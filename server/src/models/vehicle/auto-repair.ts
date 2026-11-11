import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const AutoRepair = mongoose.model<IServicePlace>('AutoRepair', createPlaceSchema());
export default AutoRepair;
