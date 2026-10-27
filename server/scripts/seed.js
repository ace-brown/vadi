// Fill the database with the German sample data.
//
//   npm run seed              insert data into empty collections only
//   npm run seed -- --reset   delete the listings first, then insert
//   npm run seed -- --admin-only   only create/promote the admin user
//
// If ADMIN_EMAIL and ADMIN_PASSWORD are set, an admin user is created
// (or an existing user with that email is promoted and its password reset).
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { getMongoUri } = require('../src/db');
const resources = require('../src/resources');
const User = require('../src/models/user');
const { data } = require('../seed/data');

async function seedAdmin() {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.log('Skipping admin user (set ADMIN_EMAIL and ADMIN_PASSWORD to create one).');
        return;
    }
    if (ADMIN_PASSWORD.length < 6) {
        throw new Error('ADMIN_PASSWORD must be at least 6 characters');
    }

    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) {
        existing.role = 'admin';
        existing.password = password;
        await existing.save();
        console.log(`Promoted ${ADMIN_EMAIL} to admin.`);
    } else {
        await User.create({
            username: 'admin',
            email: ADMIN_EMAIL.toLowerCase(),
            password,
            role: 'admin',
            profile: { fullName: 'Administrator' },
        });
        console.log(`Created admin user ${ADMIN_EMAIL}.`);
    }
}

async function main() {
    const reset = process.argv.includes('--reset');

    await mongoose.connect(getMongoUri());
    console.log(`Connected to database "${mongoose.connection.db.databaseName}".`);

    if (process.argv.includes('--admin-only')) {
        await seedAdmin();
        return;
    }

    const models = resources.map(({ model }) => model);
    const missing = Object.keys(data).filter((name) => !models.some((model) => model.modelName === name));
    if (missing.length > 0) {
        throw new Error(`Seed data has no matching model: ${missing.join(', ')}`);
    }

    // Check everything before writing anything
    if (!reset) {
        const nonEmpty = [];
        for (const model of models) {
            const count = await model.countDocuments();
            if (count > 0) nonEmpty.push(`${model.collection.name} (${count})`);
        }
        if (nonEmpty.length > 0) {
            throw new Error(
                `These collections already contain data: ${nonEmpty.join(', ')}.\n` +
                'Run "npm run seed -- --reset" to replace it.'
            );
        }
    }

    for (const model of models) {
        const rows = data[model.modelName] || [];
        if (reset) await model.deleteMany({});
        await model.insertMany(rows);
        console.log(`  ${model.collection.name}: ${rows.length}`);
    }

    await seedAdmin();
}

main()
    .then(() => console.log('Done.'))
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
