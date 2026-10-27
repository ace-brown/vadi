const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');

let mongo;
let app;
let User;
let HomeTariff;
let MobileTariff;
let Click;
let importFeed;
let adminToken;
let userToken;
let userId;

const seed = require('../seed/data');

async function login(email, password) {
    const res = await request(app).post('/api/users/login').send({ email, password });
    return res.body;
}

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri('vadi_test');
    process.env.JWT_SECRET = 'test-secret';
    process.env.CLIENT_URL = 'http://client.test';
    process.env.NODE_ENV = 'test';

    app = require('../index');
    User = require('../src/models/user');
    HomeTariff = require('../src/models/internet/home-tariff');
    MobileTariff = require('../src/models/internet/mobile-tariff');
    Click = require('../src/models/click');
    ({ importFeed } = require('../src/import-offers'));

    await mongoose.connection.asPromise();
    await Promise.all(Object.values(mongoose.models).map((model) => model.init()));

    await importFeed({
        providers: seed.providers,
        homeTariffs: seed.data.HomeTariff,
        mobileTariffs: seed.data.MobileTariff,
    });

    await User.create({
        username: 'admin',
        email: 'admin@test.dev',
        password: await bcrypt.hash('admin-pass', 4),
        role: 'admin',
        profile: { fullName: 'Admin' },
    });
    adminToken = (await login('admin@test.dev', 'admin-pass')).token;

    const signup = await request(app).post('/api/users/signup').send({
        username: 'jane', fullName: 'Jane Doe', email: 'jane@test.dev', password: 'secret12',
    });
    userToken = signup.body.token;
    userId = signup.body.userId;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

describe('health', () => {
    test('reports the database connection', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok', db: true });
    });
});

describe('offers', () => {
    test('effective monthly price includes promo, fees and bonus over 24 months', async () => {
        // Allnet 50: 9.99 for 6 months, then 19.99 for 18 months, plus 39.99 setup fee
        const offer = await MobileTariff.findOne({ externalId: 'fuchs-allnet50' });
        expect(offer.totalCost24).toBeCloseTo(9.99 * 6 + 19.99 * 18 + 39.99, 2);
        expect(offer.effectiveMonthlyPrice).toBeCloseTo((9.99 * 6 + 19.99 * 18 + 39.99) / 24, 2);

        // Unlimited: 49.99 x 24 + 39.99 setup - 120 bonus
        const unlimited = await MobileTariff.findOne({ externalId: 'fuchs-unlimited' });
        expect(unlimited.totalCost24).toBeCloseTo(49.99 * 24 + 39.99 - 120, 2);
    });

    test('lists offers sorted by effective price, with the provider attached', async () => {
        const res = await request(app).get('/api/internet/mobile-tariffs');
        expect(res.status).toBe(200);
        expect(res.body.total).toBe(seed.data.MobileTariff.length);
        const prices = res.body.items.map((item) => item.effectiveMonthlyPrice);
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
        expect(res.body.items[0].providerId.name).toBeTruthy();
        expect(res.body.ranges.effectiveMonthlyPrice.min).toBe(prices[0]);
    });

    test('a minimum data filter keeps unlimited plans', async () => {
        const res = await request(app).get('/api/internet/mobile-tariffs?dataGBMin=60');
        const names = res.body.items.map((item) => item.name);
        expect(names).toEqual(expect.arrayContaining(['5G Max 100', 'Unlimited']));
        expect(names).not.toContain('Allnet 50');
    });

    test('postcode filter keeps nationwide offers and covered regional ones', async () => {
        const hamburg = await request(app).get('/api/internet/home-tariffs?postcode=20095');
        const munich = await request(app).get('/api/internet/home-tariffs?postcode=80331');
        const leipzig = await request(app).get('/api/internet/home-tariffs?postcode=04109');

        const types = (res) => new Set(res.body.items.map((item) => item.connectionType));
        expect(types(hamburg)).toEqual(new Set(['Fiber', 'Cable', 'VDSL', 'DSL', 'LTE']));
        expect(types(munich).has('Fiber')).toBe(false);
        expect(types(munich).has('Cable')).toBe(true);
        expect(types(leipzig)).toEqual(new Set(['VDSL', 'DSL', 'LTE']));
    });

    test('rejects an invalid postcode', async () => {
        const res = await request(app).get('/api/internet/home-tariffs?postcode=123');
        expect(res.status).toBe(400);
    });

    test('hides inactive and expired offers from visitors but not from admins', async () => {
        await MobileTariff.updateOne({ externalId: 'igel-flex10' }, { active: false });
        await MobileTariff.updateOne({ externalId: 'igel-basic300' }, { validUntil: new Date('2020-01-01') });

        const visitor = await request(app).get('/api/internet/mobile-tariffs');
        const admin = await request(app)
            .get('/api/internet/mobile-tariffs?includeInactive=true')
            .set('Authorization', `Bearer ${adminToken}`);
        const userTrying = await request(app)
            .get('/api/internet/mobile-tariffs?includeInactive=true')
            .set('Authorization', `Bearer ${userToken}`);

        expect(visitor.body.total).toBe(seed.data.MobileTariff.length - 2);
        expect(admin.body.total).toBe(seed.data.MobileTariff.length);
        expect(userTrying.body.total).toBe(seed.data.MobileTariff.length - 2);

        await MobileTariff.updateOne({ externalId: 'igel-flex10' }, { active: true });
        await MobileTariff.updateOne({ externalId: 'igel-basic300' }, { validUntil: null });
    });
});

describe('admin CRUD', () => {
    test('normal users cannot create offers', async () => {
        const res = await request(app)
            .post('/api/internet/mobile-tariffs')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'x' });
        expect(res.status).toBe(403);
    });

    test('admins can create and update an offer, and the effective price is recalculated', async () => {
        const provider = (await request(app).get('/api/providers?slug=igel')).body.items[0];
        const created = await request(app)
            .post('/api/internet/mobile-tariffs')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                providerId: provider._id, name: 'Test 40', contractType: 'contract', network: '5G',
                dataGB: 40, termMonths: 24, monthlyPrice: 10, setupFee: 24, effectiveMonthlyPrice: 0,
            });
        expect(created.status).toBe(201);
        expect(created.body.item.provider).toBe('Igel Mobil');
        expect(created.body.item.effectiveMonthlyPrice).toBe(11);
        expect(created.body.item.createdBy).toBeTruthy();

        const updated = await request(app)
            .patch(`/api/internet/mobile-tariffs/${created.body.item._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ monthlyPrice: 20 });
        expect(updated.body.item.effectiveMonthlyPrice).toBe(21);

        const removed = await request(app)
            .delete(`/api/internet/mobile-tariffs/${created.body.item._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(removed.status).toBe(200);
    });

    test('rejects invalid offers with field errors', async () => {
        const res = await request(app)
            .post('/api/internet/home-tariffs')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Broken', termMonths: 7, affiliateUrl: 'javascript:alert(1)' });
        expect(res.status).toBe(422);
        const fields = res.body.errors.map((error) => error.field);
        expect(fields).toEqual(expect.arrayContaining(['providerId', 'termMonths', 'affiliateUrl']));
    });

    test('a provider with offers cannot be deleted', async () => {
        const provider = (await request(app).get('/api/providers?slug=fuchs')).body.items[0];
        const res = await request(app)
            .delete(`/api/providers/${provider._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(409);
    });
});

describe('go to offer', () => {
    test('redirects to the affiliate URL and logs the click', async () => {
        const offer = await MobileTariff.findOne({ externalId: 'moewe-prepaid-s' });
        offer.affiliateUrl = 'https://partner.example/offer?id=1';
        await offer.save();

        const res = await request(app).get(`/api/go/mobile/${offer._id}`);
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('https://partner.example/offer?id=1');
        expect(await Click.countDocuments({ offer: offer._id })).toBe(1);
    });

    test('offers without a partner link go to the explanation page', async () => {
        const offer = await HomeTariff.findOne({ externalId: 'spreewelle-vdsl100' });
        const res = await request(app).get(`/api/go/home/${offer._id}`);
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/^http:\/\/client\.test\/partner-redirect\?/);
    });

    test('unknown offers are 404', async () => {
        const res = await request(app).get('/api/go/home/650000000000000000000000');
        expect(res.status).toBe(404);
    });
});

describe('users', () => {
    test('passwords are hashed and never returned', async () => {
        const user = await User.findById(userId);
        expect(user.password).not.toBe('secret12');
        expect(await bcrypt.compare('secret12', user.password)).toBe(true);

        const res = await request(app).get(`/api/users/${userId}`).set('Authorization', `Bearer ${userToken}`);
        expect(res.body.user.password).toBeUndefined();
    });

    test('wrong password is rejected', async () => {
        const res = await request(app).post('/api/users/login').send({ email: 'jane@test.dev', password: 'wrong-pass' });
        expect(res.status).toBe(401);
    });

    test('users cannot read other accounts', async () => {
        const admin = await User.findOne({ email: 'admin@test.dev' });
        const res = await request(app).get(`/api/users/${admin.id}`).set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(403);
    });

    test('language setting accepts de and en', async () => {
        const ok = await request(app).patch(`/api/users/${userId}`).set('Authorization', `Bearer ${userToken}`).send({ language: 'en' });
        const bad = await request(app).patch(`/api/users/${userId}`).set('Authorization', `Bearer ${userToken}`).send({ language: 'fa' });
        expect(ok.status).toBe(200);
        expect(bad.status).toBe(422);
    });
});

describe('reviews', () => {
    test('are published only after approval', async () => {
        const provider = (await request(app).get('/api/providers?slug=elbstrom')).body.items[0];

        const created = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ provider: provider._id, rating: 4, title: 'Fast', text: 'Installation was quick and speed is as promised.' });
        expect(created.status).toBe(201);

        const duplicate = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ provider: provider._id, rating: 5, text: 'Writing a second review here.' });
        expect(duplicate.status).toBe(409);

        let list = await request(app).get(`/api/reviews?provider=${provider._id}`);
        expect(list.body.count).toBe(0);

        const pending = await request(app).get('/api/reviews/moderation').set('Authorization', `Bearer ${adminToken}`);
        expect(pending.body.reviews).toHaveLength(1);

        await request(app)
            .patch(`/api/reviews/${pending.body.reviews[0]._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'approved' });

        list = await request(app).get(`/api/reviews?provider=${provider._id}`);
        expect(list.body.count).toBe(1);
        expect(list.body.average).toBe(4);
        expect(list.body.reviews[0].authorName).toBe('Jane Doe');
    });

    test('anonymous users cannot write reviews', async () => {
        const res = await request(app).post('/api/reviews').send({ rating: 5, text: 'Anonymous review text.' });
        expect(res.status).toBe(401);
    });
});

describe('import', () => {
    test('updates existing offers and switches off offers missing from the feed', async () => {
        const moewe = seed.data.MobileTariff.filter((offer) => offer.providerSlug === 'moewe');
        const feed = {
            mobileTariffs: [{ ...moewe[0], monthlyPrice: 6.99 }],
        };
        const summary = await importFeed(feed);
        expect(summary.errors).toEqual([]);
        expect(summary.offers.updated).toBe(1);
        expect(summary.offers.deactivated).toBe(1);

        const updated = await MobileTariff.findOne({ externalId: moewe[0].externalId });
        expect(updated.monthlyPrice).toBe(6.99);
        expect(updated.lastCheckedAt).toBeInstanceOf(Date);
        const dropped = await MobileTariff.findOne({ externalId: moewe[1].externalId });
        expect(dropped.active).toBe(false);
    });
});

describe('my account', () => {
    const auth = () => ({ Authorization: `Bearer ${userToken}` });

    test('requires login', async () => {
        const res = await request(app).get('/api/me/saved-offers');
        expect(res.status).toBe(401);
    });

    test('watchlist saves the price at the time and shows the current one', async () => {
        const offer = await MobileTariff.findOne({ externalId: 'fuchs-allnet20' });
        const saved = await request(app).put(`/api/me/saved-offers/mobile/${offer._id}`).set(auth());
        expect(saved.status).toBe(200);
        // Saving twice doesn't duplicate
        await request(app).put(`/api/me/saved-offers/mobile/${offer._id}`).set(auth());

        offer.monthlyPrice = 10.99;
        await offer.save();

        const list = await request(app).get('/api/me/saved-offers').set(auth());
        expect(list.body.items).toHaveLength(1);
        const [item] = list.body.items;
        expect(item.savedPrice).toBeCloseTo((12.99 * 24 + 39.99) / 24, 2);
        expect(item.offer.effectiveMonthlyPrice).toBeCloseTo((10.99 * 24 + 39.99) / 24, 2);
        expect(item.offer.providerId.name).toBe('Fuchs Mobile');
        expect(item.available).toBe(true);

        const removed = await request(app).delete(`/api/me/saved-offers/mobile/${offer._id}`).set(auth());
        expect(removed.body.saved).toEqual([]);
    });

    test('saved comparisons can be created, listed and deleted', async () => {
        const offers = await HomeTariff.find().limit(2);
        const created = await request(app)
            .post('/api/me/comparisons')
            .set(auth())
            .send({ kind: 'home', offerIds: offers.map((o) => String(o._id)), name: 'Fiber vs cable' });
        expect(created.status).toBe(201);

        const tooMany = await request(app)
            .post('/api/me/comparisons')
            .set(auth())
            .send({ kind: 'home', offerIds: ['a', 'b', 'c', 'd'] });
        expect(tooMany.status).toBe(422);

        const list = await request(app).get('/api/me/comparisons').set(auth());
        expect(list.body.items).toHaveLength(1);
        expect(list.body.items[0].name).toBe('Fiber vs cable');
        expect(list.body.items[0].offers[0].effectiveMonthlyPrice).toBeGreaterThan(0);

        const removed = await request(app).delete(`/api/me/comparisons/${created.body.comparison._id}`).set(auth());
        expect(removed.status).toBe(200);
    });

    test('lists my own reviews including pending ones', async () => {
        const res = await request(app).get('/api/me/reviews').set(auth());
        expect(res.status).toBe(200);
        expect(res.body.reviews.length).toBeGreaterThan(0);
        expect(res.body.reviews[0].provider.name).toBeTruthy();
    });
});

describe('Vadi score', () => {
    test('every active offer has a grade between 1 and 5 with its parts', async () => {
        const res = await request(app).get('/api/internet/home-tariffs?limit=100');
        res.body.items.forEach((offer) => {
            expect(offer.score).toBeGreaterThanOrEqual(1);
            expect(offer.score).toBeLessThanOrEqual(5);
            expect(Object.keys(offer.scoreDetails)).toEqual(['price', 'performance', 'flexibility', 'provider']);
        });
    });

    test('can sort by score (best first)', async () => {
        const res = await request(app).get('/api/internet/mobile-tariffs?sort=score');
        const scores = res.body.items.map((offer) => offer.score);
        expect(scores).toEqual([...scores].sort((a, b) => a - b));
    });

    test('is recalculated when an offer gets much cheaper', async () => {
        const offer = await HomeTariff.findOne({ externalId: 'alpenfunk-lte50' });
        const before = (await request(app).get(`/api/internet/home-tariffs/${offer._id}`)).body.item.score;
        await request(app)
            .patch(`/api/internet/home-tariffs/${offer._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ monthlyPrice: 5 });
        const after = (await request(app).get(`/api/internet/home-tariffs/${offer._id}`)).body.item.score;
        expect(after).toBeLessThan(before);
    });
});

describe('facets', () => {
    test('count each option while ignoring that filter itself', async () => {
        const all = await request(app).get('/api/internet/mobile-tariffs');
        const prepaid = await request(app).get('/api/internet/mobile-tariffs?contractType=prepaid');
        // contractType counts are unaffected by the contractType filter...
        expect(prepaid.body.facets.contractType).toEqual(all.body.facets.contractType);
        // ...but the other facets only count prepaid offers
        const termTotal = Object.values(prepaid.body.facets.termMonths).reduce((a, b) => a + b, 0);
        expect(termTotal).toBe(prepaid.body.total);
    });
});

describe('price history and alerts', () => {
    const auth = () => ({ Authorization: `Bearer ${userToken}` });

    test('records every change of the effective price', async () => {
        const offer = await HomeTariff.findOne({ externalId: 'isarlink-vdsl250' });
        const before = (await request(app).get(`/api/price-history/home/${offer._id}`)).body.history.length;

        await request(app).patch(`/api/internet/home-tariffs/${offer._id}`).set('Authorization', `Bearer ${adminToken}`).send({ monthlyPrice: 44.99 });
        // Saving without a price change adds nothing
        await request(app).patch(`/api/internet/home-tariffs/${offer._id}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'VDSL 250' });

        const res = await request(app).get(`/api/price-history/home/${offer._id}`);
        expect(res.body.history.length).toBe(before + 1);
        const item = (await request(app).get(`/api/internet/home-tariffs/${offer._id}`)).body.item;
        expect(item.previousEffectiveMonthlyPrice).toBeGreaterThan(item.effectiveMonthlyPrice);
        expect(item.priceChangedAt).toBeTruthy();
    });

    test('alerts email the user once the target price is reached', async () => {
        const { outbox } = require('../src/mailer');
        const offer = await HomeTariff.findOne({ externalId: 'spreewelle-vdsl100' });
        const target = Math.floor(offer.effectiveMonthlyPrice) - 5;

        const set = await request(app).put(`/api/me/price-alerts/home/${offer._id}`).set(auth()).send({ targetPrice: target });
        expect(set.status).toBe(200);

        // Price still above the target: nothing sent
        const { checkPriceAlerts } = require('../src/jobs/price-alerts');
        let result = await checkPriceAlerts();
        expect(result.triggered).toBe(0);

        await request(app).patch(`/api/internet/home-tariffs/${offer._id}`).set('Authorization', `Bearer ${adminToken}`).send({ monthlyPrice: 20 });

        // The job endpoint needs the cron secret or an admin
        process.env.CRON_SECRET = 'cron-secret-123';
        expect((await request(app).post('/api/jobs/price-alerts')).status).toBe(401);
        const job = await request(app).get('/api/jobs/price-alerts').set('Authorization', 'Bearer cron-secret-123');
        expect(job.body.triggered).toBe(1);
        expect(outbox[outbox.length - 1].to).toBe('jane@test.dev');
        // Jane switched her language to English in an earlier test
        expect(outbox[outbox.length - 1].subject).toMatch(/^Price alert: Spreewelle DSL VDSL 100/);

        // Fired alerts switch off
        result = await checkPriceAlerts();
        expect(result.triggered).toBe(0);
        const list = await request(app).get('/api/me/price-alerts').set(auth());
        expect(list.body.items[0].active).toBe(false);
        expect(list.body.items[0].triggeredPrice).toBeLessThanOrEqual(target);
    });
});

describe('advisor', () => {
    test('mobile: recommendations meet the needs, with reasons', async () => {
        const res = await request(app).post('/api/advisor/mobile').send({ dataGB: 40, need5G: true });
        expect(res.status).toBe(200);
        expect(res.body.relaxed).toEqual([]);
        expect(res.body.recommendations.length).toBeGreaterThan(0);
        res.body.recommendations.forEach(({ offer, reasons }) => {
            expect(offer.network).toBe('5G');
            expect(offer.dataGB === null || offer.dataGB >= 40).toBe(true);
            expect(reasons.map((r) => r.code)).toContain('network5G');
        });
        expect(res.body.recommendations[0].labels).toContain('cheapest');
    });

    test('mobile: relaxes the budget when nothing fits it', async () => {
        const res = await request(app).post('/api/advisor/mobile').send({ dataGB: 50, budget: 1 });
        expect(res.body.relaxed).toEqual(['budget']);
        expect(res.body.recommendations[0].reasons.map((r) => r.code)).toContain('overBudget');
    });

    test('home: works out the speed needed and relaxes what is impossible', async () => {
        // Leipzig has no fiber or cable in the sample data, so gaming's low latency can't be met
        const res = await request(app).post('/api/advisor/home').send({ postcode: '04109', people: 3, usage: ['streaming', 'gaming'] });
        expect(res.status).toBe(200);
        expect(res.body.needs.minDownloadMbps).toBe(250);
        expect(res.body.relaxed).toContain('latency');
    });

    test('home: rejects a missing postcode', async () => {
        const res = await request(app).post('/api/advisor/home').send({ people: 2 });
        expect(res.status).toBe(422);
    });
});

describe('address availability', () => {
    const address = { postcode: '20095', street: 'Mönckebergstraße', houseNumber: '7' };

    test('returns connections per provider and caches the result', async () => {
        const first = await request(app).post('/api/availability').send(address);
        expect(first.status).toBe(200);
        expect(first.body.cached).toBe(false);
        expect(first.body.providers.length).toBeGreaterThan(0);
        first.body.providers.forEach((provider) => expect(provider.source).toBe('sample'));

        const second = await request(app).post('/api/availability').send(address);
        expect(second.body.cached).toBe(true);
        expect(second.body.providers).toEqual(first.body.providers);
    });

    test('filters home internet to what is bookable at the address', async () => {
        const check = await request(app).post('/api/availability').send(address);
        const byPostcode = await request(app).get('/api/internet/home-tariffs?postcode=20095&limit=100');
        const byAddress = await request(app).get(`/api/internet/home-tariffs?postcode=20095&street=${encodeURIComponent(address.street)}&houseNumber=7&limit=100`);

        expect(byAddress.body.total).toBeLessThanOrEqual(byPostcode.body.total);
        byAddress.body.items.forEach((offer) => {
            const provider = check.body.providers.find((p) => p.providerId === offer.providerId._id);
            const connection = provider.connections.find((c) => c.connectionType === offer.connectionType);
            expect(connection).toBeTruthy();
            expect(offer.downloadMbps).toBeLessThanOrEqual(connection.maxDownloadMbps);
        });
    });

    test('rejects incomplete addresses', async () => {
        const res = await request(app).post('/api/availability').send({ postcode: '20095', street: '', houseNumber: '7' });
        expect(res.status).toBe(400);
    });
});

describe('caching and docs', () => {
    test('public lists are cacheable and support ETags', async () => {
        const first = await request(app).get('/api/internet/mobile-tariffs');
        expect(first.headers['cache-control']).toMatch(/public, max-age=60/);
        expect(first.headers.etag).toBeTruthy();
        const second = await request(app).get('/api/internet/mobile-tariffs').set('If-None-Match', first.headers.etag);
        expect(second.status).toBe(304);
    });

    test('personal data is never cached', async () => {
        const res = await request(app).get('/api/me/saved-offers').set('Authorization', `Bearer ${userToken}`);
        expect(res.headers['cache-control']).toBe('private, no-store');
    });

    test('serves the OpenAPI description and Swagger UI', async () => {
        const spec = await request(app).get('/api/openapi.json');
        expect(spec.body.openapi).toBe('3.0.3');
        expect(spec.body.paths['/api/advisor/mobile']).toBeTruthy();
        const docs = await request(app).get('/api/docs/');
        expect(docs.status).toBe(200);
        expect(docs.text).toMatch(/swagger/i);
    });
});
