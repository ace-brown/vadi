const MobileTariff = require('./models/internet/mobile-tariff');
const HomeTariff = require('./models/internet/home-tariff');
const MenSalonPlan = require('./models/aesthetic/men-salon-plan');
const WomenSalonPlan = require('./models/aesthetic/women-salon-plan');
const AutoRepair = require('./models/vehicle/auto-repair');
const MotorcycleRepair = require('./models/vehicle/motorcycle-repair');
const ApplianceRepair = require('./models/electronics/appliance-repair');
const MobileRepair = require('./models/PM/mobile-repair');
const ComputerRepair = require('./models/PM/computer-repair');
const GardenSupplies = require('./models/agriculture/garden-supplies');
const AnimalBasedProducts = require('./models/agriculture/animal-based-products');
const DentalService = require('./models/healthcare/dental-service');
const Bookstore = require('./models/education/bookstore');
const EduCenter = require('./models/education/education-center');

// What each kind of listing can be searched, filtered and sorted by
const placeOptions = {
    searchFields: ['title', 'address', 'city', 'services'],
    matchFields: { city: 'string', state: 'string' },
    rangeFields: ['rating'],
    sortFields: ['title', 'rating', 'city'],
    defaultSort: '-rating',
};

function salonOptions(priceFields) {
    return {
        searchFields: ['title', 'address', 'city'],
        matchFields: { city: 'string', state: 'string' },
        rangeFields: [...priceFields, 'rating'],
        sortFields: [...priceFields, 'title', 'rating'],
        defaultSort: priceFields[0],
    };
}

const resources = [
    {
        path: '/api/internet/mobile-tariffs',
        model: MobileTariff,
        options: {
            searchFields: ['provider', 'name'],
            matchFields: { provider: 'string', contractType: 'string', network: 'string', termMonths: 'number' },
            rangeFields: ['monthlyPrice', 'dataGB', 'minutes', 'setupFee'],
            unlimitedFields: ['dataGB', 'minutes'],
            sortFields: ['monthlyPrice', 'setupFee', 'provider'],
            defaultSort: 'monthlyPrice',
        },
    },
    {
        path: '/api/internet/home-tariffs',
        model: HomeTariff,
        options: {
            searchFields: ['provider', 'name'],
            matchFields: { provider: 'string', connectionType: 'string', termMonths: 'number' },
            rangeFields: ['monthlyPrice', 'downloadMbps', 'uploadMbps', 'setupFee'],
            sortFields: ['monthlyPrice', 'downloadMbps', 'setupFee', 'provider'],
            defaultSort: 'monthlyPrice',
        },
    },
    { path: '/api/aesthetic/men-salon', model: MenSalonPlan, options: salonOptions(MenSalonPlan.PRICE_FIELDS) },
    { path: '/api/aesthetic/women-salon', model: WomenSalonPlan, options: salonOptions(WomenSalonPlan.PRICE_FIELDS) },
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

module.exports = resources;
