import mongoose from 'mongoose';
import { createPlaceSchema, type IServicePlace } from '../schemas/place-schema';

const AnimalBasedProducts = mongoose.model<IServicePlace>('AnimalBasedProducts', createPlaceSchema());
export default AnimalBasedProducts;
