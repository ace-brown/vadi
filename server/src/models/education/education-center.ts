import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const EduCenter = mongoose.model<IServicePlace>('EduCenter', createPlaceSchema());
export default EduCenter;
