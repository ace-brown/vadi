import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const MotorcycleRepair = mongoose.model<IServicePlace>('MotorcycleRepair', createPlaceSchema());
export default MotorcycleRepair;
