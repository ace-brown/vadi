// OpenAPI 3 description of the API, served at /api/openapi.json and /api/docs.
// The generic listing endpoints are generated from src/resources.js.
const resources = require('./resources');
const { SCORE_WEIGHTS } = require('./scoring');

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema, description = 'OK') => ({ description, content: { 'application/json': { schema } } });
const error = (description) => json(ref('Error'), description);
const bearer = [{ bearerAuth: [] }];
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'string' } };
const kindParam = { name: 'kind', in: 'path', required: true, schema: { type: 'string', enum: ['home', 'mobile'] } };
const query = (name, description, schema = { type: 'string' }) => ({ name, in: 'query', description, schema });

const OFFER_SCHEMAS = {
    '/api/internet/home-tariffs': 'HomeOffer',
    '/api/internet/mobile-tariffs': 'MobileOffer',
    '/api/providers': 'Provider',
};

function listingPaths({ path, options }) {
    const tag = path.replace('/api/', '').split('/')[0];
    const item = ref(OFFER_SCHEMAS[path] ?? 'Listing');
    const parameters = [
        query('q', `Text search in: ${(options.searchFields ?? []).join(', ')}`),
        ...Object.entries(options.matchFields ?? {}).map(([field, type]) =>
            query(field, `Exact match; several values comma-separated`, { type: type === 'number' ? 'string' : 'string' })),
        ...Object.keys(options.customFilters ?? {}).map((param) => query(param, param === 'street'
            ? 'With postcode and houseNumber: only offers bookable at this address'
            : 'Custom filter')),
        ...(options.customFilters?.street ? [query('houseNumber', 'Used with street')] : []),
        ...(options.rangeFields ?? []).flatMap((field) => [
            query(`${field}Min`, `Minimum ${field}`, { type: 'number' }),
            query(`${field}Max`, `Maximum ${field}`, { type: 'number' }),
        ]),
        query('sort', `One of ${(options.sortFields ?? []).join(', ')}; prefix with - for descending. Default ${options.defaultSort}`),
        query('page', 'Page number', { type: 'integer', minimum: 1 }),
        query('limit', 'Page size (max 100)', { type: 'integer', minimum: 1, maximum: 100 }),
        ...(options.baseFilter ? [query('includeInactive', 'Admins only: include inactive and expired items', { type: 'boolean' })] : []),
    ];
    return {
        [path]: {
            get: {
                tags: [tag],
                summary: 'List with search, filters, sorting, pagination, ranges and facet counts',
                parameters,
                responses: {
                    200: json({
                        type: 'object',
                        properties: {
                            items: { type: 'array', items: item },
                            total: { type: 'integer' },
                            page: { type: 'integer' },
                            pages: { type: 'integer' },
                            ranges: { type: 'object', description: 'Min/max per range field across all visible items', additionalProperties: ref('Range') },
                            facets: { type: 'object', description: 'Counts per value of each facet field, ignoring that field\'s own filter', additionalProperties: { type: 'object', additionalProperties: { type: 'integer' } } },
                        },
                    }),
                    400: error('Invalid query parameter'),
                },
            },
            post: {
                tags: [tag], summary: 'Create (admin)', security: bearer,
                requestBody: { content: { 'application/json': { schema: item } } },
                responses: { 201: json({ type: 'object', properties: { item } }, 'Created'), 401: error('Not logged in'), 403: error('Not an admin'), 422: ref('ValidationErrorResponse') },
            },
        },
        [`${path}/{id}`]: {
            get: { tags: [tag], summary: 'Get one', parameters: [idParam], responses: { 200: json({ type: 'object', properties: { item } }), 404: error('Not found') } },
            patch: {
                tags: [tag], summary: 'Update (admin)', security: bearer, parameters: [idParam],
                requestBody: { content: { 'application/json': { schema: item } } },
                responses: { 200: json({ type: 'object', properties: { item } }), 404: error('Not found'), 422: ref('ValidationErrorResponse') },
            },
            delete: { tags: [tag], summary: 'Delete (admin)', security: bearer, parameters: [idParam], responses: { 200: json(ref('Message')), 404: error('Not found'), 409: error('Still in use') } },
        },
    };
}

const offerProperties = {
    _id: { type: 'string', readOnly: true },
    providerId: { description: 'Provider ID (populated with the provider when reading)', oneOf: [{ type: 'string' }, ref('Provider')] },
    provider: { type: 'string', readOnly: true },
    name: { type: 'string' },
    externalId: { type: 'string', description: 'ID in the partner feed' },
    termMonths: { type: 'integer', enum: [1, 12, 24] },
    monthlyPrice: { type: 'number', description: 'Price during the promo period, if any' },
    promoMonths: { type: 'integer' },
    regularPrice: { type: 'number', nullable: true, description: 'Price after the promo period' },
    setupFee: { type: 'number' },
    hardwareFee: { type: 'number' },
    bonus: { type: 'number' },
    totalCost24: { type: 'number', readOnly: true },
    effectiveMonthlyPrice: { type: 'number', readOnly: true, description: 'Average monthly cost over 24 months including fees and bonuses' },
    previousEffectiveMonthlyPrice: { type: 'number', nullable: true, readOnly: true },
    priceChangedAt: { type: 'string', format: 'date-time', nullable: true, readOnly: true },
    score: { type: 'number', nullable: true, readOnly: true, description: `Vadi score, 1.0 (best) to 5.0. Weights: ${Object.entries(SCORE_WEIGHTS).map(([k, w]) => `${k} ${w * 100}%`).join(', ')}` },
    scoreDetails: { type: 'object', readOnly: true, properties: { price: { type: 'number' }, performance: { type: 'number' }, flexibility: { type: 'number' }, provider: { type: 'number' } } },
    affiliateUrl: { type: 'string', format: 'uri', nullable: true },
    active: { type: 'boolean' },
    validFrom: { type: 'string', format: 'date-time', nullable: true },
    validUntil: { type: 'string', format: 'date-time', nullable: true },
    lastCheckedAt: { type: 'string', format: 'date-time', nullable: true },
};

const savedOfferRoutes = (base, extra = {}) => ({
    [`${base}/{kind}/{id}`]: {
        put: { tags: ['me'], summary: extra.putSummary, security: bearer, parameters: [kindParam, idParam], ...(extra.body ? { requestBody: extra.body } : {}), responses: { 200: json({ type: 'object' }), 404: error('Offer not found') } },
        delete: { tags: ['me'], summary: 'Remove', security: bearer, parameters: [kindParam, idParam], responses: { 200: json({ type: 'object' }) } },
    },
});

module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'Vadi API',
        version: '1.0.0',
        description: 'Comparison of internet and mobile plans in Germany. Public reads are cacheable for 60 s and support ETags. Log in with POST /api/users/login and send the token as "Authorization: Bearer <token>".',
    },
    servers: [{ url: '/' }],
    components: {
        securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
        schemas: {
            Error: { type: 'object', properties: { message: { type: 'string' } } },
            Message: { type: 'object', properties: { message: { type: 'string' } } },
            ValidationErrorResponse: {
                description: 'Invalid input',
                content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, errors: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, message: { type: 'string' } } } } } } } },
            },
            Range: { type: 'object', properties: { min: { type: 'number', nullable: true }, max: { type: 'number', nullable: true } } },
            Provider: {
                type: 'object',
                properties: {
                    _id: { type: 'string', readOnly: true }, name: { type: 'string' }, slug: { type: 'string' }, logo: { type: 'string' },
                    website: { type: 'string' }, legalName: { type: 'string' }, imprintUrl: { type: 'string' }, description: { type: 'string' },
                    rating: { type: 'number', minimum: 0, maximum: 5 }, ratingSource: { type: 'string' },
                },
            },
            HomeOffer: {
                type: 'object',
                properties: {
                    ...offerProperties,
                    connectionType: { type: 'string', enum: ['DSL', 'VDSL', 'Cable', 'Fiber', 'LTE'] },
                    downloadMbps: { type: 'number' },
                    uploadMbps: { type: 'number' },
                    coverage: { type: 'object', properties: { nationwide: { type: 'boolean' }, postcodePrefixes: { type: 'array', items: { type: 'string' } } } },
                },
            },
            MobileOffer: {
                type: 'object',
                properties: {
                    ...offerProperties,
                    contractType: { type: 'string', enum: ['prepaid', 'contract'] },
                    network: { type: 'string', enum: ['4G', '5G'] },
                    dataGB: { type: 'number', nullable: true, description: 'null = unlimited' },
                    minutes: { type: 'number', nullable: true, description: 'null = unlimited' },
                },
            },
            Listing: { type: 'object', description: 'A place (shop, clinic, salon...) with title, address, city, state, rating and services or prices', additionalProperties: true },
            Reason: { type: 'object', properties: { code: { type: 'string' }, params: { type: 'object', additionalProperties: true } } },
            Recommendation: {
                type: 'object',
                properties: {
                    offer: { oneOf: [ref('HomeOffer'), ref('MobileOffer')] },
                    labels: { type: 'array', items: { type: 'string', enum: ['cheapest', 'bestScore'] } },
                    reasons: { type: 'array', items: ref('Reason') },
                },
            },
            Address: {
                type: 'object',
                required: ['postcode', 'street', 'houseNumber'],
                properties: { postcode: { type: 'string', example: '20095' }, street: { type: 'string', example: 'Mönckebergstraße' }, houseNumber: { type: 'string', example: '7' } },
            },
        },
    },
    paths: {
        ...Object.assign({}, ...resources.map(listingPaths)),

        '/api/advisor/mobile': {
            post: {
                tags: ['advisor'],
                summary: 'Recommend mobile plans for your needs',
                description: 'Returns up to 3 offers that meet all needs, sorted by effective price. If none fit, the budget and then the least important needs are relaxed; `relaxed` lists which.',
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: {
                    dataGB: { type: 'number', nullable: true, description: 'GB per month; null = unlimited' },
                    unlimitedCalls: { type: 'boolean' }, need5G: { type: 'boolean' }, monthlyCancellable: { type: 'boolean' },
                    planType: { type: 'string', enum: ['prepaid', 'contract', 'any'] }, budget: { type: 'number', description: 'Max effective price per month' },
                } } } } },
                responses: { 200: json({ type: 'object', properties: { needs: { type: 'object' }, relaxed: { type: 'array', items: { type: 'string' } }, recommendations: { type: 'array', items: ref('Recommendation') } } }), 422: error('Invalid input') },
            },
        },
        '/api/advisor/home': {
            post: {
                tags: ['advisor'],
                summary: 'Recommend home internet for your household',
                description: 'Works out the speed you need from the number of people and usage, then recommends offers available at the postcode (or exact address).',
                requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['postcode'], properties: {
                    postcode: { type: 'string' }, street: { type: 'string' }, houseNumber: { type: 'string' },
                    people: { type: 'integer', minimum: 1, maximum: 10 },
                    usage: { type: 'array', items: { type: 'string', enum: ['basic', 'streaming', 'gaming', 'homeoffice'] } },
                    monthlyCancellable: { type: 'boolean' }, budget: { type: 'number' },
                } } } } },
                responses: { 200: json({ type: 'object', properties: { needs: { type: 'object' }, relaxed: { type: 'array', items: { type: 'string' } }, recommendations: { type: 'array', items: ref('Recommendation') } } }), 422: error('Invalid input') },
            },
        },
        '/api/availability': {
            post: {
                tags: ['availability'],
                summary: 'Which connections each provider offers at an address',
                description: 'Uses provider adapters (sample adapter for the demo data); results are cached for 7 days.',
                requestBody: { content: { 'application/json': { schema: ref('Address') } } },
                responses: { 200: json({ type: 'object', properties: {
                    address: ref('Address'), checkedAt: { type: 'string', format: 'date-time' }, cached: { type: 'boolean' },
                    providers: { type: 'array', items: { type: 'object', properties: {
                        providerId: { type: 'string' }, provider: { type: 'string' }, source: { type: 'string', enum: ['sample', 'postcode', 'error'] },
                        connections: { type: 'array', items: { type: 'object', properties: { connectionType: { type: 'string' }, maxDownloadMbps: { type: 'number' } } } },
                    } } },
                } }), 400: error('Invalid address') },
            },
        },
        '/api/price-history/{kind}/{id}': {
            get: {
                tags: ['offers'], summary: 'Effective price over time', parameters: [kindParam, idParam],
                responses: { 200: json({ type: 'object', properties: { history: { type: 'array', items: { type: 'object', properties: { effectiveMonthlyPrice: { type: 'number' }, monthlyPrice: { type: 'number' }, recordedAt: { type: 'string', format: 'date-time' } } } } } }), 404: error('Not found') },
            },
        },
        '/api/go/{kind}/{id}': {
            get: { tags: ['offers'], summary: 'Count the click and redirect to the provider', parameters: [kindParam, idParam], responses: { 302: { description: 'Redirect to the affiliate URL' }, 404: error('Not found') } },
        },
        '/api/go/stats': {
            get: { tags: ['admin'], summary: 'Clicks per offer (admin)', security: bearer, parameters: [query('days', 'Period in days (max 365)', { type: 'integer' })], responses: { 200: json({ type: 'object' }) } },
        },
        '/api/reviews': {
            get: { tags: ['reviews'], summary: 'Approved reviews of a provider', parameters: [{ ...query('provider', 'Provider ID'), required: true }], responses: { 200: json({ type: 'object', properties: { reviews: { type: 'array', items: { type: 'object' } }, count: { type: 'integer' }, average: { type: 'number', nullable: true } } }) } },
            post: { tags: ['reviews'], summary: 'Write a review (published after moderation)', security: bearer, requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['provider', 'rating', 'text'], properties: { provider: { type: 'string' }, rating: { type: 'integer', minimum: 1, maximum: 5 }, title: { type: 'string' }, text: { type: 'string', minLength: 10 } } } } } }, responses: { 201: json({ type: 'object' }, 'Created'), 409: error('Already reviewed') } },
        },
        '/api/me/saved-offers': { get: { tags: ['me'], summary: 'Watchlist with saved vs. current price', security: bearer, responses: { 200: json({ type: 'object' }) } } },
        ...savedOfferRoutes('/api/me/saved-offers', { putSummary: 'Add to the watchlist' }),
        '/api/me/price-alerts': { get: { tags: ['me'], summary: 'Price alerts with current prices', security: bearer, responses: { 200: json({ type: 'object' }) } } },
        ...savedOfferRoutes('/api/me/price-alerts', {
            putSummary: 'Create or update a price alert (emails when the effective price is at or below targetPrice)',
            body: { content: { 'application/json': { schema: { type: 'object', required: ['targetPrice'], properties: { targetPrice: { type: 'number' } } } } } },
        }),
        '/api/me/comparisons': {
            get: { tags: ['me'], summary: 'Saved comparisons', security: bearer, responses: { 200: json({ type: 'object' }) } },
            post: { tags: ['me'], summary: 'Save a comparison', security: bearer, requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['kind', 'offerIds'], properties: { kind: { type: 'string', enum: ['home', 'mobile'] }, offerIds: { type: 'array', items: { type: 'string' }, maxItems: 3 }, name: { type: 'string' } } } } } }, responses: { 201: json({ type: 'object' }, 'Created') } },
        },
        '/api/me/reviews': { get: { tags: ['me'], summary: 'Your reviews with moderation status', security: bearer, responses: { 200: json({ type: 'object' }) } } },
        '/api/jobs/price-alerts': {
            post: { tags: ['admin'], summary: 'Send due price alert emails (admin, or "Authorization: Bearer <CRON_SECRET>"; GET works too)', security: bearer, responses: { 200: json({ type: 'object', properties: { checked: { type: 'integer' }, triggered: { type: 'integer' } } }) } },
        },
        '/api/users/signup': { post: { tags: ['users'], summary: 'Create an account', responses: { 201: json({ type: 'object' }, 'Created'), 422: error('Invalid input or user exists') } } },
        '/api/users/login': { post: { tags: ['users'], summary: 'Log in; returns a token valid for 1 hour', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 200: json({ type: 'object' }), 401: error('Invalid credentials') } } },
        '/api/health': { get: { tags: ['system'], summary: 'Health check', responses: { 200: json({ type: 'object' }), 503: error('Database not connected') } } },
    },
};
