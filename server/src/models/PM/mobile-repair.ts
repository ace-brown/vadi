import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const MobileRepair = mongoose.model<IServicePlace>('MobileRepair', createPlaceSchema());
export default MobileRepair;
