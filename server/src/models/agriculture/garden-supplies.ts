import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const GardenSupplies = mongoose.model<IServicePlace>('GardenSupplies', createPlaceSchema());
export default GardenSupplies;
