import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const DentalService = mongoose.model<IServicePlace>('DentalService', createPlaceSchema());
export default DentalService;
