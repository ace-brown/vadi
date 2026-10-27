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
