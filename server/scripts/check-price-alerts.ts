// Email users whose price alert target has been reached.
//   npm run alerts
// Run it on a schedule, or after importing new prices.
import 'dotenv/config';

import mongoose from 'mongoose';
import { getMongoUri } from '../src/db';
import { checkPriceAlerts } from '../src/jobs/price-alerts';

mongoose
    .connect(getMongoUri())
    .then(checkPriceAlerts)
    .then(({ checked, triggered }) => console.log(`Checked ${checked} alert(s), sent ${triggered} email(s).`))
    .catch((err: Error) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
