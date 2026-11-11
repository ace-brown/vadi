import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const Bookstore = mongoose.model<IServicePlace>('Bookstore', createPlaceSchema());
export default Bookstore;
