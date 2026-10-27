const mongoose = require('mongoose');
const HttpError = require('../models/http-error');

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;
const PROTECTED_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];

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
function buildFilter(query, config) {
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
        } else {
            const patterns = values.map((value) => new RegExp(`^${escapeRegex(value)}$`, 'i'));
            conditions.push({ [field]: { $in: patterns } });
        }
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
async function getRanges(Model, config) {
    if (config.rangeFields.length === 0) return {};

    const group = { _id: null };
    config.rangeFields.forEach((field) => {
        group[`${field}__min`] = { $min: `$${field}` };
        group[`${field}__max`] = { $max: `$${field}` };
    });
    const [stats] = await Model.aggregate([{ $group: group }]);

    const ranges = {};
    config.rangeFields.forEach((field) => {
        ranges[field] = {
            min: stats ? stats[`${field}__min`] ?? null : null,
            max: stats ? stats[`${field}__max`] ?? null : null,
        };
    });
    return ranges;
}

function getBodyData(req) {
    const data = { ...req.body };
    PROTECTED_FIELDS.forEach((field) => delete data[field]);
    if (req.file) {
        data.image = `uploads/images/${req.file.filename}`;
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
        ...options,
    };
    if (!config.sortFields.includes(config.defaultSort.replace(/^-/, ''))) {
        config.sortFields = [...config.sortFields, config.defaultSort.replace(/^-/, '')];
    }

    // GET / — list with search, filters, sorting and pagination
    async function list(req, res) {
        const filter = buildFilter(req.query, config);
        const sort = buildSort(req.query.sort, config);
        const limit = Math.min(MAX_LIMIT, Math.max(1, parseNumber(req.query.limit, 'limit') ?? DEFAULT_LIMIT));
        const page = Math.max(1, Math.floor(parseNumber(req.query.page, 'page') ?? 1));

        const [items, total, ranges] = await Promise.all([
            Model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
            Model.countDocuments(filter),
            getRanges(Model, config),
        ]);

        res.json({ items, total, page, pages: Math.ceil(total / limit), ranges });
    }

    // GET /:id
    async function getOne(req, res) {
        checkId(req.params.id);
        const item = await Model.findById(req.params.id);
        if (!item) {
            throw new HttpError('Could not find an item for the provided ID', 404);
        }
        res.json({ item });
    }

    // POST / — admin only
    async function create(req, res) {
        const item = await Model.create(getBodyData(req));
        res.status(201).json({ item });
    }

    // PATCH /:id — admin only
    async function update(req, res) {
        checkId(req.params.id);
        const item = await Model.findByIdAndUpdate(req.params.id, getBodyData(req), {
            new: true,
            runValidators: true,
        });
        if (!item) {
            throw new HttpError('Could not find an item for the provided ID', 404);
        }
        res.json({ item });
    }

    // DELETE /:id — admin only
    async function remove(req, res) {
        checkId(req.params.id);
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) {
            throw new HttpError('Could not find an item for the provided ID', 404);
        }
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
