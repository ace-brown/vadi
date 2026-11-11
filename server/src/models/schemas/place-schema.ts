import mongoose from 'mongoose';

// Fields shared by every listing that is a physical place (shops, clinics, salons...)
export interface IPlace {
    title: string;
    address: string;
    city: string;
    state: string;
    rating?: number;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// A place with a list of services
export interface IServicePlace extends IPlace {
    services: string[];
}

// A place with a price per service, e.g. { haircutPrice: 28 }
export type IPricedPlace = IPlace & Record<string, unknown>;

const placeFields: mongoose.SchemaDefinition = {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 80, index: true },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, min: 0, max: 5 },
    image: { type: String, trim: true, maxlength: 300 },
};

const price = { type: Number, required: true, min: 0 };

// A place that offers a list of services, e.g. a repair shop or a bookstore
export function createPlaceSchema() {
    return new mongoose.Schema<IServicePlace>(
        {
            ...placeFields,
            services: {
                type: [{ type: String, trim: true, maxlength: 120 }],
                default: [],
                validate: {
                    validator: (services: string[]) => services.length <= 20,
                    message: 'A listing can have at most 20 services',
                },
            },
        },
        { timestamps: true }
    );
}

// A place with a fixed price for each of the given services, e.g. a salon
export function createPricedPlaceSchema(priceFields: readonly string[]) {
    const fields: mongoose.SchemaDefinition = { ...placeFields };
    priceFields.forEach((field) => {
        fields[field] = price;
    });
    return new mongoose.Schema<IPricedPlace>(fields, { timestamps: true });
}
