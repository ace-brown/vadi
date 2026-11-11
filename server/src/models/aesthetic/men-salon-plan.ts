import mongoose from 'mongoose';
import { createPricedPlaceSchema, type IPricedPlace } from '../schemas/place-schema';

export const PRICE_FIELDS = ['haircutPrice', 'menLiftPrice', 'groomMakeupPrice', 'curlyHairDoPrice'];

const MenSalonPlan = mongoose.model<IPricedPlace>('MenSalonPlan', createPricedPlaceSchema(PRICE_FIELDS));
export default MenSalonPlan;
