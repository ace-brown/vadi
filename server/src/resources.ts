import MobileTariff from './models/internet/mobile-tariff';
import HomeTariff from './models/internet/home-tariff';
import MenSalonPlan, { PRICE_FIELDS as MEN_SALON_PRICE_FIELDS } from './models/aesthetic/men-salon-plan';
import WomenSalonPlan, { PRICE_FIELDS as WOMEN_SALON_PRICE_FIELDS } from './models/aesthetic/women-salon-plan';
import AutoRepair from './models/vehicle/auto-repair';
import MotorcycleRepair from './models/vehicle/motorcycle-repair';
import ApplianceRepair from './models/electronics/appliance-repair';
import MobileRepair from './models/PM/mobile-repair';
import ComputerRepair from './models/PM/computer-repair';
import GardenSupplies from './models/agriculture/garden-supplies';
import AnimalBasedProducts from './models/agriculture/animal-based-products';
import DentalService from './models/healthcare/dental-service';
import Bookstore from './models/education/bookstore';
import EduCenter from './models/education/education-center';
import Provider from './models/provider';
import HttpError from './models/http-error';
import AvailabilityCheck from './models/availability-check';
import { activeOfferFilter } from './models/schemas/offer-schema';
import { recomputeScores, recomputeAllScores } from './scoring';
import { addressFilter } from './availability';
import type { AnyModel, ResourceOptions } from './controllers/resource-controllers';

export interface Resource {
    path: string;
    model: AnyModel;
    options: ResourceOptions;
}

const PROVIDER_FIELDS = 'name slug logo website legalName imprintUrl rating ratingSource';

// ?postcode=10115 keeps nationwide offers and offers whose coverage includes the postcode
function postcodeFilter(postcode: string) {
    if (!/^\d{5}$/.test(postcode)) {
        throw new HttpError('Postcode must have 5 digits', 400);
    }
    const prefixes = [1, 2, 3, 4, 5].map((length) => postcode.slice(0, length));
    return {
        $or: [
            { 'coverage.nationwide': true },
            { 'coverage.postcodePrefixes': { $in: prefixes } },
        ],
    };
}

// What each kind of listing can be searched, filtered and sorted by
const placeOptions: ResourceOptions = {
    searchFields: ['title', 'address', 'city', 'services'],
    matchFields: { city: 'string', state: 'string' },
    rangeFields: ['rating'],
    sortFields: ['title', 'rating', 'city'],
    defaultSort: '-rating',
};

function salonOptions(priceFields: string[]): ResourceOptions {
    return {
        searchFields: ['title', 'address', 'city'],
        matchFields: { city: 'string', state: 'string' },
        rangeFields: [...priceFields, 'rating'],
        sortFields: [...priceFields, 'title', 'rating'],
        defaultSort: priceFields[0],
    };
}

const resources: Resource[] = [
    {
        path: '/api/internet/mobile-tariffs',
        model: MobileTariff,
        options: {
            searchFields: ['provider', 'name'],
            matchFields: { provider: 'string', providerId: 'id', contractType: 'string', network: 'string', termMonths: 'number' },
            rangeFields: ['effectiveMonthlyPrice', 'monthlyPrice', 'dataGB', 'minutes', 'setupFee', 'score'],
            unlimitedFields: ['dataGB', 'minutes'],
            sortFields: ['effectiveMonthlyPrice', 'monthlyPrice', 'setupFee', 'provider', 'updatedAt', 'score'],
            defaultSort: 'effectiveMonthlyPrice',
            facetFields: ['contractType', 'termMonths', 'network'],
            baseFilter: activeOfferFilter,
            populate: { path: 'providerId', select: PROVIDER_FIELDS },
            afterChange: () => recomputeScores('mobile'),
        },
    },
    {
        path: '/api/internet/home-tariffs',
        model: HomeTariff,
        options: {
            searchFields: ['provider', 'name'],
            matchFields: { provider: 'string', providerId: 'id', connectionType: 'string', termMonths: 'number' },
            rangeFields: ['effectiveMonthlyPrice', 'monthlyPrice', 'downloadMbps', 'uploadMbps', 'setupFee', 'score'],
            sortFields: ['effectiveMonthlyPrice', 'monthlyPrice', 'downloadMbps', 'setupFee', 'provider', 'updatedAt', 'score'],
            defaultSort: 'effectiveMonthlyPrice',
            facetFields: ['connectionType', 'termMonths'],
            // ?street=&houseNumber= (with ?postcode=) narrows results to what's bookable at the address
            customFilters: { postcode: postcodeFilter, street: addressFilter },
            baseFilter: activeOfferFilter,
            populate: { path: 'providerId', select: PROVIDER_FIELDS },
            afterChange: async () => {
                await recomputeScores('home');
                // Cached address checks are derived from the offers
                await AvailabilityCheck.deleteMany({});
            },
        },
    },
    {
        path: '/api/providers',
        model: Provider,
        options: {
            searchFields: ['name', 'legalName'],
            matchFields: { slug: 'string' },
            sortFields: ['name', 'rating'],
            defaultSort: 'name',
            // Provider ratings are part of every offer's score
            afterChange: recomputeAllScores,
            beforeRemove: async (provider) => {
                const offers = await HomeTariff.countDocuments({ providerId: provider._id })
                    + await MobileTariff.countDocuments({ providerId: provider._id });
                if (offers > 0) {
                    throw new HttpError(`This provider still has ${offers} offer(s). Delete or move them first.`, 409);
                }
            },
        },
    },
    { path: '/api/aesthetic/men-salon', model: MenSalonPlan, options: salonOptions(MEN_SALON_PRICE_FIELDS) },
    { path: '/api/aesthetic/women-salon', model: WomenSalonPlan, options: salonOptions(WOMEN_SALON_PRICE_FIELDS) },
    { path: '/api/vehicle/auto-repair', model: AutoRepair, options: placeOptions },
    { path: '/api/vehicle/motorcycle-repair', model: MotorcycleRepair, options: placeOptions },
    { path: '/api/electronics/appliance-repair', model: ApplianceRepair, options: placeOptions },
    { path: '/api/pc-mobile/mobile-repair', model: MobileRepair, options: placeOptions },
    { path: '/api/pc-mobile/computer-repair', model: ComputerRepair, options: placeOptions },
    { path: '/api/agriculture/garden-supplies', model: GardenSupplies, options: placeOptions },
    { path: '/api/agriculture/animal-based-products', model: AnimalBasedProducts, options: placeOptions },
    { path: '/api/healthcare/dental', model: DentalService, options: placeOptions },
    { path: '/api/education/bookstores', model: Bookstore, options: placeOptions },
    { path: '/api/education/centers', model: EduCenter, options: placeOptions },
];

export default resources;
