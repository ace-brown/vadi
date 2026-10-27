const mongoose = require('mongoose');
const HttpError = require('../models/http-error');

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;
const RANGES_CACHE_MS = 60 * 1000;
const PROTECTED_FIELDS = [
    '_id', '__v', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy',
    'totalCost24', 'effectiveMonthlyPrice', 'previousEffectiveMonthlyPrice', 'priceChangedAt',
    'score', 'scoreDetails',
];

// Wrap async handlers so rejected promises reach the error middleware
function asyncHandler(handler) {
    return (req, res, next) => handler(req, res, next).catch(next);
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseNumber(value, name) {
    if (value === undefined || value === '') return undefined;
    const number = Number(value);
    if (Number.isNaN(number)) {
        throw new HttpError(`Query parameter "${name}" must be a number`, 400);
    }
    return number;
}

// Turn the query string into a MongoDB filter, based on what the resource allows:
//   ?q=text                 search in config.searchFields
//   ?city=Berlin,Hamburg    exact (case-insensitive) match on config.matchFields
//   ?monthlyPriceMax=30     range on config.rangeFields (<field>Min / <field>Max)
//   anything in config.customFilters, which may be async and see the whole query
async function buildFilter(query, config) {
    const conditions = [];

    const term = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : '';
    if (term && config.searchFields.length > 0) {
        const pattern = new RegExp(escapeRegex(term), 'i');
        conditions.push({ $or: config.searchFields.map((field) => ({ [field]: pattern })) });
    }

    for (const [field, type] of Object.entries(config.matchFields)) {
        if (query[field] === undefined || query[field] === '') continue;
        const values = String(query[field])
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);
        if (values.length === 0) continue;

        if (type === 'number') {
            const numbers = values.map((value) => parseNumber(value, field));
            conditions.push({ [field]: { $in: numbers } });
        } else if (type === 'id') {
            values.forEach((value) => checkId(value));
            conditions.push({ [field]: { $in: values } });
        } else {
            const patterns = values.map((value) => new RegExp(`^${escapeRegex(value)}$`, 'i'));
            conditions.push({ [field]: { $in: patterns } });
        }
    }

    for (const [param, buildCondition] of Object.entries(config.customFilters)) {
        if (query[param] === undefined || query[param] === '') continue;
        const condition = await buildCondition(String(query[param]), query);
        if (condition) conditions.push(condition);
    }

    for (const field of config.rangeFields) {
        const min = parseNumber(query[`${field}Min`], `${field}Min`);
        const max = parseNumber(query[`${field}Max`], `${field}Max`);
        // For fields where null means "unlimited", unlimited always satisfies a minimum
        const nullIsUnlimited = config.unlimitedFields.includes(field);

        if (min !== undefined) {
            conditions.push(
                nullIsUnlimited
                    ? { $or: [{ [field]: null }, { [field]: { $gte: min } }] }
                    : { [field]: { $gte: min } }
            );
        }
        if (max !== undefined) {
            conditions.push({ [field]: { $ne: null, $lte: max } });
        }
    }

    return conditions.length > 0 ? { $and: conditions } : {};
}

function buildSort(sortParam, config) {
    const requested = typeof sortParam === 'string' && sortParam ? sortParam : config.defaultSort;
    const field = requested.replace(/^-/, '');
    if (!config.sortFields.includes(field)) {
        throw new HttpError(`Cannot sort by "${field}". Allowed: ${config.sortFields.join(', ')}`, 400);
    }
    return { [field]: requested.startsWith('-') ? -1 : 1, _id: 1 };
}

// Smallest and largest value of every range field across the whole collection,
// so the client can size its sliders without hard-coding prices
async function getRanges(Model, config, baseFilter) {
    if (config.rangeFields.length === 0) return {};

    const group = { _id: null };
    config.rangeFields.forEach((field) => {
        group[`${field}__min`] = { $min: `$${field}` };
        group[`${field}__max`] = { $max: `$${field}` };
    });
    const [stats] = await Model.aggregate([{ $match: baseFilter }, { $group: group }]);

    const ranges = {};
    config.rangeFields.forEach((field) => {
        ranges[field] = {
            min: stats ? stats[`${field}__min`] ?? null : null,
            max: stats ? stats[`${field}__max`] ?? null : null,
        };
    });
    return ranges;
}

// Count matches per value of each facet field. Each facet ignores its own filter
// ("disjunctive" facets), so the counts show what ticking another option would add.
async function getFacets(Model, config, query, visible) {
    const counts = await Promise.all(config.facetFields.map(async (field) => {
        const { [field]: _ignored, ...otherFilters } = query;
        const filter = await buildFilter(otherFilters, config);
        const match = Object.keys(visible).length > 0 ? { $and: [visible, filter] } : filter;
        const rows = await Model.aggregate([
            { $match: match },
            { $group: { _id: `$${field}`, count: { $sum: 1 } } },
        ]);
        // Sorted, so identical results give identical responses (and ETags)
        const sorted = rows
            .map((row) => [String(row._id), row.count])
            .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }));
        return [field, Object.fromEntries(sorted)];
    }));
    return Object.fromEntries(counts);
}

function getBodyData(req, Model) {
    const data = { ...req.body };
    PROTECTED_FIELDS.forEach((field) => delete data[field]);
    if (req.file) {
        data.image = `uploads/images/${req.file.filename}`;
    }
    // Remember which admin last changed the item
    if (Model.schema.path('updatedBy') && req.userData) {
        data.updatedBy = req.userData.userId;
    }
    return data;
}

function checkId(id) {
    if (!mongoose.isValidObjectId(id)) {
        throw new HttpError('Invalid ID', 400);
    }
}

function createResourceControllers(Model, options = {}) {
    const config = {
        searchFields: [],
        matchFields: {},
        rangeFields: [],
        unlimitedFields: [],
        sortFields: [],
        defaultSort: '_id',
        customFilters: {},
        // Filter applied to what visitors see (admins can pass ?includeInactive=true)
        baseFilter: null,
        populate: null,
        // Called before deleting; throw an HttpError to prevent it
        beforeRemove: null,
        // Called after any create, update or delete (e.g. to recalculate scores)
        afterChange: null,
        // Fields whose values are counted for the filter UI (see getFacets)
        facetFields: [],
        ...options,
    };
    let rangesCache = null;

    function visibleFilter(req) {
        const isAdmin = req.userData?.role === 'admin';
        if (!config.baseFilter || (isAdmin && req.query.includeInactive === 'true')) {
            return {};
        }
        return config.baseFilter();
    }

    async function cachedRanges() {
        if (!rangesCache || rangesCache.expires < Date.now()) {
            const filter = config.baseFilter ? config.baseFilter() : {};
            rangesCache = { value: await getRanges(Model, config, filter), expires: Date.now() + RANGES_CACHE_MS };
        }
        return rangesCache.value;
    }

    function withPopulate(query) {
        return config.populate ? query.populate(config.populate) : query;
    }
    if (!config.sortFields.includes(config.defaultSort.replace(/^-/, ''))) {
        config.sortFields = [...config.sortFields, config.defaultSort.replace(/^-/, '')];
    }

    // GET / — list with search, filters, sorting and pagination
    async function list(req, res) {
        const queryFilter = await buildFilter(req.query, config);
        const visible = visibleFilter(req);
        const filter = Object.keys(visible).length > 0 ? { $and: [visible, queryFilter] } : queryFilter;
        const sort = buildSort(req.query.sort, config);
        const limit = Math.min(MAX_LIMIT, Math.max(1, parseNumber(req.query.limit, 'limit') ?? DEFAULT_LIMIT));
        const page = Math.max(1, Math.floor(parseNumber(req.query.page, 'page') ?? 1));

        const [items, total, ranges, facets] = await Promise.all([
            withPopulate(Model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit)),
            Model.countDocuments(filter),
            cachedRanges(),
            getFacets(Model, config, req.query, visible),
        ]);

        res.json({ items, total, page, pages: Math.ceil(total / limit), ranges, facets });
    }

    // GET /:id
    async function getOne(req, res) {
        checkId(req.params.id);
        const item = await withPopulate(Model.findOne({ $and: [{ _id: req.params.id }, visibleFilter(req)] }));
        if (!item) {
            throw new HttpError('Could not find an item for the provided ID', 404);
        }
        res.json({ item });
    }

    // POST / — admin only
    async function create(req, res) {
        const data = getBodyData(req, Model);
        if (Model.schema.path('createdBy') && req.userData) {
            data.createdBy = req.userData.userId;
        }
        const item = await Model.create(data);
        rangesCache = null;
        if (config.afterChange) await config.afterChange();
        res.status(201).json({ item });
    }

    // PATCH /:id — admin only
    async function update(req, res) {
        checkId(req.params.id);
        const item = await Model.findById(req.params.id);
        if (!item) {
            throw new HttpError('Could not find an item for the provided ID', 404);
        }
        // Load, change and save (rather than findByIdAndUpdate) so save hooks run,
        // e.g. recalculating an offer's effective price
        item.set(getBodyData(req, Model));
        await item.save();
        rangesCache = null;
        if (config.afterChange) await config.afterChange();
        res.json({ item });
    }

    // DELETE /:id — admin only
    async function remove(req, res) {
        checkId(req.params.id);
        const item = await Model.findById(req.params.id);
        if (!item) {
            throw new HttpError('Could not find an item for the provided ID', 404);
        }
        if (config.beforeRemove) {
            await config.beforeRemove(item);
        }
        await item.deleteOne();
        rangesCache = null;
        if (config.afterChange) await config.afterChange();
        res.json({ message: 'Deleted successfully' });
    }

    return {
        list: asyncHandler(list),
        getOne: asyncHandler(getOne),
        create: asyncHandler(create),
        update: asyncHandler(update),
        remove: asyncHandler(remove),
    };
}

exports.createResourceControllers = createResourceControllers;
exports.asyncHandler = asyncHandler;
