import mongoose from 'mongoose';
import { createPricedPlaceSchema, type IPricedPlace } from '../schemas/place-schema';

export const PRICE_FIELDS = [
    'faceCarePrice',
    'hairBotoxPrice',
    'hairColorPrice',
    'makeupPrice',
    'eyelashExtensionPrice',
    'eyebrowShapePrice',
    'eyebrowLiftPrice',
    'nailExtensionPrice',
    'manicurePrice',
    'waxingPrice',
];

const WomenSalonPlan = mongoose.model<IPricedPlace>('WomenSalonPlan', createPricedPlaceSchema(PRICE_FIELDS));
export default WomenSalonPlan;
