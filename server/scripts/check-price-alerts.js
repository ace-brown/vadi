// Email users whose price alert target has been reached.
//   npm run alerts
// Run it on a schedule, or after importing new prices.
require('dotenv').config();

const mongoose = require('mongoose');
const { getMongoUri } = require('../src/db');
const { checkPriceAlerts } = require('../src/jobs/price-alerts');

mongoose
    .connect(getMongoUri())
    .then(checkPriceAlerts)
    .then(({ checked, triggered }) => console.log(`Checked ${checked} alert(s), sent ${triggered} email(s).`))
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
