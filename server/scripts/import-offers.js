// Import providers and offers from a JSON feed file.
//
//   npm run import -- path/to/feed.json            import
//   npm run import -- path/to/feed.json --dry-run  validate and report only
//
// See seed/example-feed.json for the format, and src/import-offers.js for the rules.
// Run it on a schedule (e.g. a daily cron job) to keep prices current.
require('dotenv').config();

const fs = require('fs');
const mongoose = require('mongoose');

const { getMongoUri } = require('../src/db');
const { importFeed } = require('../src/import-offers');

async function main() {
    const file = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
    const dryRun = process.argv.includes('--dry-run');
    if (!file) {
        throw new Error('Usage: npm run import -- <feed.json> [--dry-run]');
    }

    const feed = JSON.parse(fs.readFileSync(file, 'utf8'));
    await mongoose.connect(getMongoUri());
    console.log(`${dryRun ? 'Checking' : 'Importing'} ${file} into "${mongoose.connection.db.databaseName}"...`);

    const summary = await importFeed(feed, { dryRun });
    console.log(`Providers: ${summary.providers.created} new, ${summary.providers.updated} updated`);
    console.log(`Offers: ${summary.offers.created} new, ${summary.offers.updated} updated, ${summary.offers.deactivated} switched off`);
    if (summary.errors.length > 0) {
        console.error(`${summary.errors.length} error(s):\n  ${summary.errors.join('\n  ')}`);
        process.exitCode = 1;
    }
}

main()
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
