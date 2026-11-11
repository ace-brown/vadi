import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const ApplianceRepair = mongoose.model<IServicePlace>('ApplianceRepair', createPlaceSchema());
export default ApplianceRepair;
