import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const ComputerRepair = mongoose.model<IServicePlace>('ComputerRepair', createPlaceSchema());
export default ComputerRepair;
