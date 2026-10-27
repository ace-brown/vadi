// Sample data for Germany. All businesses and providers are fictional;
// addresses use real street names, prices are in euros.

const STATES = {
    Berlin: 'Berlin',
    Hamburg: 'Hamburg',
    Bremen: 'Bremen',
    Munich: 'Bavaria',
    Nuremberg: 'Bavaria',
    Cologne: 'North Rhine-Westphalia',
    Düsseldorf: 'North Rhine-Westphalia',
    Dortmund: 'North Rhine-Westphalia',
    Bonn: 'North Rhine-Westphalia',
    'Frankfurt am Main': 'Hesse',
    Stuttgart: 'Baden-Württemberg',
    'Freiburg im Breisgau': 'Baden-Württemberg',
    Leipzig: 'Saxony',
    Dresden: 'Saxony',
    Hanover: 'Lower Saxony',
    Lüneburg: 'Lower Saxony',
    Potsdam: 'Brandenburg',
};

function img(name) {
    return `uploads/images/${name}`;
}

// [title, street, postcode, city, rating, services, image]
function places(rows) {
    return rows.map(([title, street, postcode, city, rating, services, image]) => {
        if (!STATES[city]) throw new Error(`Unknown city in seed data: ${city}`);
        return {
            title,
            address: `${street}, ${postcode} ${city}`,
            city,
            state: STATES[city],
            rating,
            services,
            image: img(image),
        };
    });
}

// [title, street, postcode, city, rating, image, prices]
function salons(rows) {
    return rows.map(([title, street, postcode, city, rating, image, prices]) => ({
        title,
        address: `${street}, ${postcode} ${city}`,
        city,
        state: STATES[city],
        rating,
        image: img(image),
        ...prices,
    }));
}

const autoRepairs = places([
    ['Kfz-Werkstatt Brandt', 'Sonnenallee 112', '12045', 'Berlin', 4.6, ['Oil change', 'Brake pad replacement', 'TÜV inspection prep', 'A/C service'], 'auto-repair-1.jpg'],
    ['Autoservice Elbblick', 'Stresemannstraße 210', '22769', 'Hamburg', 4.3, ['Engine diagnostics', 'Timing belt replacement', 'Tyre change & storage'], 'auto-repair-2.jpg'],
    ['Meisterbetrieb Huber', 'Landsberger Straße 280', '80687', 'Munich', 4.8, ['Annual service', 'Clutch repair', 'Exhaust repair', 'Electric & hybrid service'], 'auto-repair-3.jpg'],
    ['Domstadt Garage', 'Venloer Straße 390', '50825', 'Cologne', 4.1, ['Oil change', 'Battery replacement', 'Spark plug replacement'], 'auto-repair-1.jpg'],
    ['Autohaus Werkstatt Neckar', 'Pragstraße 90', '70376', 'Stuttgart', 4.5, ['Suspension repair', 'Wheel alignment', 'Brake repair', 'Bodywork & paint'], 'auto-repair-2.jpg'],
    ['Messestadt Kfz-Service', 'Torgauer Straße 160', '04347', 'Leipzig', 4.4, ['Engine tuning', 'Gearbox repair', 'Tyre change & storage'], 'auto-repair-3.jpg'],
]);

const motorcycleRepairs = places([
    ['Zweirad Kowalski', 'Hermannstraße 140', '12051', 'Berlin', 4.7, ['Annual service', 'Chain & sprocket replacement', 'Tyre fitting'], 'motorcycle-repair-1.jpg'],
    ['Moto Hafenkante', 'Holstenstraße 75', '22767', 'Hamburg', 4.2, ['Carburettor tuning', 'Electrical repair', 'Brake service'], 'motorcycle-repair-2.jpg'],
    ['Isar Bikes Werkstatt', 'Plinganserstraße 45', '81369', 'Munich', 4.6, ['Engine overhaul', 'Suspension setup', 'Scooter service'], 'motorcycle-repair-3.jpg'],
    ['Rheinufer Motorrad', 'Kölner Landstraße 60', '40591', 'Düsseldorf', 4.0, ['Annual service', 'Battery replacement', 'Pre-inspection check'], 'motorcycle-repair-1.jpg'],
    ['Zweiradzentrum Mainhattan', 'Hanauer Landstraße 210', '60314', 'Frankfurt am Main', 4.4, ['Chain & sprocket replacement', 'Brake service', 'Custom parts fitting'], 'motorcycle-repair-2.jpg'],
]);

const applianceRepairs = places([
    ['Hausgeräte-Service Lindner', 'Wilmersdorfer Straße 95', '10629', 'Berlin', 4.5, ['Washing machine repair', 'Dishwasher repair', 'Fridge repair', 'Same-day call-outs'], 'appliance-1.jpg'],
    ['Weiße Ware Nord', 'Fuhlsbüttler Straße 300', '22307', 'Hamburg', 4.2, ['Oven & stove repair', 'Dryer repair', 'Spare parts'], 'appliance-2.jpg'],
    ['Gerätedoktor Bayern', 'Rosenheimer Straße 120', '81669', 'Munich', 4.7, ['Fridge repair', 'Coffee machine repair', 'Microwave repair'], 'appliance-3.jpg'],
    ['Rhein-Ruhr Hausgeräte', 'Rheinische Straße 110', '44137', 'Dortmund', 4.0, ['Washing machine repair', 'Boiler service', 'Vacuum cleaner repair'], 'appliance-1.jpg'],
    ['Elbtal Geräteservice', 'Königsbrücker Straße 70', '01099', 'Dresden', 4.4, ['Dishwasher repair', 'Oven & stove repair', 'Installation service'], 'appliance-2.jpg'],
]);

const mobileRepairs = places([
    ['Handyklinik Kreuzberg', 'Oranienstraße 160', '10969', 'Berlin', 4.6, ['Screen replacement', 'Battery replacement', 'Water damage repair', 'Data recovery'], 'mobile-repair-1.jpg'],
    ['Smartfix Altona', 'Ottenser Hauptstraße 40', '22765', 'Hamburg', 4.3, ['Screen replacement', 'Charging port repair', 'Camera repair'], 'mobile-repair-2.jpg'],
    ['Phone Atelier Schwabing', 'Leopoldstraße 75', '80802', 'Munich', 4.8, ['Board-level repair', 'Battery replacement', 'Back glass replacement'], 'mobile-repair-3.jpg'],
    ['Ehrenfeld Handy Service', 'Venloer Straße 280', '50823', 'Cologne', 4.1, ['Screen replacement', 'Software reset', 'Speaker & microphone repair'], 'mobile-repair-1.jpg'],
    ['Display Doktor Hannover', 'Lister Meile 50', '30161', 'Hanover', 4.5, ['Screen replacement', 'Water damage repair', 'Tablet repair'], 'mobile-repair-2.jpg'],
    ['Südstadt Smartphone Hilfe', 'Karl-Liebknecht-Straße 90', '04275', 'Leipzig', 4.2, ['Battery replacement', 'Charging port repair', 'Data transfer'], 'mobile-repair-3.jpg'],
]);

const computerRepairs = places([
    ['PC-Werkstatt Prenzlberg', 'Schönhauser Allee 140', '10437', 'Berlin', 4.5, ['Laptop repair', 'SSD upgrade', 'Virus removal', 'Data recovery'], 'laptop-repair-1.jpg'],
    ['Hanse IT-Service', 'Grindelallee 120', '20146', 'Hamburg', 4.4, ['Custom PC builds', 'Mac repair', 'Network setup'], 'laptop-repair-2.jpg'],
    ['Rechnerhilfe Maxvorstadt', 'Schellingstraße 60', '80799', 'Munich', 4.7, ['Laptop screen replacement', 'Motherboard repair', 'Windows & Linux setup'], 'laptop-repair-3.png'],
    ['Bytewerk Frankfurt', 'Leipziger Straße 50', '60487', 'Frankfurt am Main', 4.0, ['SSD upgrade', 'Keyboard replacement', 'Data recovery'], 'laptop-repair-1.jpg'],
    ['Neckar Notebook Service', 'Marienstraße 25', '70178', 'Stuttgart', 4.6, ['Laptop repair', 'Fan cleaning & thermal paste', 'Business IT support'], 'laptop-repair-2.jpg'],
]);

const gardenSupplies = places([
    ['Gartencenter Grünwerk', 'Britzer Damm 200', '12347', 'Berlin', 4.5, ['Organic fertiliser', 'Seeds & seedlings', 'Fruit trees', 'Potting soil'], 'Pesticides-1.jpg'],
    ['Vierlande Gartenbedarf', 'Kirchwerder Landweg 120', '21037', 'Hamburg', 4.6, ['Vegetable plants', 'Irrigation systems', 'Garden tools'], 'Pesticides-2.jpg'],
    ['Blütenhof Breisgau', 'Basler Landstraße 80', '79111', 'Freiburg im Breisgau', 4.8, ['Organic fertiliser', 'Plant protection', 'Fruit trees', 'Pots & planters'], 'Pesticides-3.jpeg'],
    ['Rheinaue Garten & Saat', 'Königswinterer Straße 300', '53227', 'Bonn', 4.2, ['Seeds & seedlings', 'Lawn care', 'Garden tools'], 'Pesticides-1.jpg'],
    ['Havelgarten Potsdam', 'Zeppelinstraße 140', '14471', 'Potsdam', 4.3, ['Potting soil', 'Shade nets', 'Irrigation systems'], 'Pesticides-2.jpg'],
]);

const animalBasedProducts = places([
    ['Hofladen Sonnenwiese', 'Altenbrücker Damm 15', '21337', 'Lüneburg', 4.8, ['Free-range eggs', 'Farm milk', 'Butter & cheese', 'Honey'], 'diary.jpg'],
    ['Allgäuer Käsestube', 'Pfälzer Straße 30', '80335', 'Munich', 4.7, ['Mountain cheese', 'Butter', 'Yoghurt', 'Quark'], 'butter-cheese.jpg'],
    ['Metzgerei & Hofladen Brenner', 'Gostenhofer Hauptstraße 40', '90443', 'Nuremberg', 4.4, ['Organic beef', 'Pork & sausages', 'Farm eggs'], 'meat-3.jpg'],
    ['Biohof Spreewald Markt', 'Bergmannstraße 25', '10961', 'Berlin', 4.5, ['Organic milk', 'Cheese', 'Free-range eggs', 'Wool products'], 'diary.jpg'],
    ['Weserhof Direktvermarktung', 'Ostertorsteinweg 60', '28203', 'Bremen', 4.2, ['Lamb & beef', 'Butter', 'Honey'], 'meat-3.jpg'],
]);

const dentalServices = places([
    ['Zahnarztpraxis am Kollwitzplatz', 'Knaackstraße 40', '10435', 'Berlin', 4.7, ['Check-ups & cleaning', 'Fillings', 'Teeth whitening', 'Implants'], 'dental-care-1.jpg'],
    ['Zahnzentrum Eppendorf', 'Eppendorfer Landstraße 50', '20249', 'Hamburg', 4.5, ['Professional teeth cleaning', 'Invisible aligners', 'Root canal treatment'], 'dental-care-2.jpg'],
    ['Lächelwerk Zahnmedizin', 'Sendlinger Straße 30', '80331', 'Munich', 4.8, ['Implants', 'Crowns & bridges', 'Anxiety-friendly treatment'], 'dental-care-3.jpg'],
    ['Zahnarzt am Ring', 'Hohenzollernring 70', '50672', 'Cologne', 4.3, ['Check-ups & cleaning', 'Children\'s dentistry', 'Fillings'], 'dental-care-1.jpg'],
    ['Praxis Dr. Albrecht', 'Berger Straße 120', '60316', 'Frankfurt am Main', 4.6, ['Teeth whitening', 'Veneers', 'Emergency appointments'], 'dental-care-2.jpg'],
    ['Zahnmedizin Neustadt', 'Alaunstraße 45', '01099', 'Dresden', 4.4, ['Professional teeth cleaning', 'Gum treatment', 'Dentures'], 'dental-care-3.jpg'],
]);

const bookstores = places([
    ['Buchhandlung Seitenwind', 'Kastanienallee 30', '10435', 'Berlin', 4.8, ['Literature & fiction', 'English-language books', 'Author readings'], 'bookstore-1.jpg'],
    ['Leseinsel Ottensen', 'Bahrenfelder Straße 90', '22765', 'Hamburg', 4.6, ['Children\'s books', 'Graphic novels', 'Book orders within 24h'], 'bookstore-2.jpg'],
    ['Antiquariat Glockenbach', 'Fraunhoferstraße 20', '80469', 'Munich', 4.7, ['Rare & second-hand books', 'Book valuation', 'Art books'], 'bookstore-3.jpg'],
    ['Bücherstube Südstadt', 'Severinstraße 110', '50678', 'Cologne', 4.4, ['Crime fiction', 'Travel guides', 'Gift wrapping'], 'bookstore-1.jpg'],
    ['Lesezeichen Leipzig', 'Gottschedstraße 15', '04109', 'Leipzig', 4.5, ['Philosophy & humanities', 'Book club', 'Online shop'], 'bookstore-2.jpg'],
]);

const educationCenters = places([
    ['Sprachschule Spreebrücke', 'Friedrichstraße 180', '10117', 'Berlin', 4.6, ['German courses A1–C2', 'Telc & Goethe exam prep', 'Evening classes'], 'educenter-1.jpg'],
    ['Lernhafen Nachhilfe', 'Osterstraße 80', '20259', 'Hamburg', 4.3, ['Maths tutoring', 'Abitur preparation', 'Small groups'], 'educenter-2.jpg'],
    ['Akademie Isartal', 'Schwanthalerstraße 70', '80336', 'Munich', 4.7, ['English & Spanish courses', 'Business communication', 'IELTS & TOEFL prep'], 'educenter-3.jpg'],
    ['Code & Campus Köln', 'Zülpicher Straße 40', '50674', 'Cologne', 4.5, ['Web development bootcamp', 'Data analysis courses', 'Career coaching'], 'educenter-1.jpg'],
    ['Lernwerk Stuttgart', 'Königstraße 40', '70173', 'Stuttgart', 4.2, ['Homework help', 'German for children', 'Holiday courses'], 'educenter-2.jpg'],
]);

const menSalons = salons([
    ['Barbershop Kiezschnitt', 'Boxhagener Straße 35', '10245', 'Berlin', 4.7, 'men-1.jpg',
        { haircutPrice: 28, menLiftPrice: 45, groomMakeupPrice: 85, curlyHairDoPrice: 65 }],
    ['Herrensalon Hafenkante', 'Lange Reihe 60', '20099', 'Hamburg', 4.4, 'men-2.jpg',
        { haircutPrice: 35, menLiftPrice: 55, groomMakeupPrice: 110, curlyHairDoPrice: 75 }],
    ['Gentlemen\'s Club Schwabing', 'Hohenzollernstraße 50', '80801', 'Munich', 4.8, 'men-3.jpg',
        { haircutPrice: 45, menLiftPrice: 70, groomMakeupPrice: 150, curlyHairDoPrice: 95 }],
    ['Barber Ehrenfeld', 'Körnerstraße 30', '50823', 'Cologne', 4.2, 'men-1.jpg',
        { haircutPrice: 22, menLiftPrice: 35, groomMakeupPrice: 60, curlyHairDoPrice: 50 }],
    ['Schnittwerk Sachsenhausen', 'Schweizer Straße 25', '60594', 'Frankfurt am Main', 4.5, 'men-2.jpg',
        { haircutPrice: 32, menLiftPrice: 50, groomMakeupPrice: 95, curlyHairDoPrice: 70 }],
    ['Barbier Plagwitz', 'Karl-Heine-Straße 55', '04229', 'Leipzig', 4.6, 'men-3.jpg',
        { haircutPrice: 25, menLiftPrice: 40, groomMakeupPrice: 75, curlyHairDoPrice: 55 }],
]);

const womenSalons = salons([
    ['Salon Lindenblüte', 'Kantstraße 45', '10625', 'Berlin', 4.6, 'women-1.jpg',
        { faceCarePrice: 65, hairBotoxPrice: 120, hairColorPrice: 85, makeupPrice: 75, eyelashExtensionPrice: 95, eyebrowShapePrice: 18, eyebrowLiftPrice: 45, nailExtensionPrice: 55, manicurePrice: 32, waxingPrice: 35 }],
    ['Beauty Atelier Alster', 'Mühlenkamp 20', '22303', 'Hamburg', 4.8, 'women-2.jpg',
        { faceCarePrice: 90, hairBotoxPrice: 160, hairColorPrice: 120, makeupPrice: 120, eyelashExtensionPrice: 140, eyebrowShapePrice: 25, eyebrowLiftPrice: 60, nailExtensionPrice: 75, manicurePrice: 45, waxingPrice: 55 }],
    ['Haarwerk Glockenbach', 'Reichenbachstraße 15', '80469', 'Munich', 4.7, 'women-3.jpg',
        { faceCarePrice: 80, hairBotoxPrice: 145, hairColorPrice: 110, makeupPrice: 95, eyelashExtensionPrice: 120, eyebrowShapePrice: 22, eyebrowLiftPrice: 55, nailExtensionPrice: 65, manicurePrice: 40, waxingPrice: 45 }],
    ['Studio Rosenrot', 'Ehrenstraße 35', '50672', 'Cologne', 4.3, 'women-4.jpg',
        { faceCarePrice: 50, hairBotoxPrice: 90, hairColorPrice: 65, makeupPrice: 55, eyelashExtensionPrice: 75, eyebrowShapePrice: 14, eyebrowLiftPrice: 38, nailExtensionPrice: 48, manicurePrice: 27, waxingPrice: 25 }],
    ['Schönheitssalon Königsallee', 'Königsallee 80', '40212', 'Düsseldorf', 4.5, 'women-5.jpg',
        { faceCarePrice: 85, hairBotoxPrice: 150, hairColorPrice: 115, makeupPrice: 110, eyelashExtensionPrice: 130, eyebrowShapePrice: 24, eyebrowLiftPrice: 58, nailExtensionPrice: 70, manicurePrice: 42, waxingPrice: 50 }],
    ['Salon Elbflorenz', 'Louisenstraße 40', '01099', 'Dresden', 4.4, 'women-1.jpg',
        { faceCarePrice: 45, hairBotoxPrice: 80, hairColorPrice: 60, makeupPrice: 50, eyelashExtensionPrice: 70, eyebrowShapePrice: 12, eyebrowLiftPrice: 35, nailExtensionPrice: 45, manicurePrice: 25, waxingPrice: 20 }],
]);

const RATING_SOURCE = 'Sample editorial rating (fictional data)';

const providers = [
    { slug: 'elbstrom', name: 'Elbstrom Glasfaser', legalName: 'Elbstrom Glasfaser GmbH (fictional)', logo: img('providers/elbstrom.svg'), rating: 4.4, ratingSource: RATING_SOURCE, description: 'Regional fiber network in Hamburg and Berlin.' },
    { slug: 'kranich', name: 'Kranich Kabel', legalName: 'Kranich Kabel GmbH (fictional)', logo: img('providers/kranich.svg'), rating: 3.9, ratingSource: RATING_SOURCE, description: 'Cable internet in large cities.' },
    { slug: 'spreewelle', name: 'Spreewelle DSL', legalName: 'Spreewelle Telekommunikation AG (fictional)', logo: img('providers/spreewelle.svg'), rating: 4.1, ratingSource: RATING_SOURCE, description: 'Nationwide DSL and VDSL.' },
    { slug: 'isarlink', name: 'Isarlink', legalName: 'Isarlink Internet GmbH (fictional)', logo: img('providers/isarlink.svg'), rating: 4.0, ratingSource: RATING_SOURCE, description: 'Flexible VDSL plans without long contracts.' },
    { slug: 'alpenfunk', name: 'Alpenfunk', legalName: 'Alpenfunk Mobilfunk GmbH (fictional)', logo: img('providers/alpenfunk.svg'), rating: 3.7, ratingSource: RATING_SOURCE, description: 'Home internet over the mobile network.' },
    { slug: 'moewe', name: 'Möwe Mobil', legalName: 'Möwe Mobil GmbH (fictional)', logo: img('providers/moewe.svg'), rating: 4.2, ratingSource: RATING_SOURCE, description: 'Prepaid SIM cards without a contract.' },
    { slug: 'fuchs', name: 'Fuchs Mobile', legalName: 'Fuchs Mobile Deutschland GmbH (fictional)', logo: img('providers/fuchs.svg'), rating: 4.3, ratingSource: RATING_SOURCE, description: '5G contract plans.' },
    { slug: 'igel', name: 'Igel Mobil', legalName: 'Igel Mobil GmbH (fictional)', logo: img('providers/igel.svg'), rating: 3.8, ratingSource: RATING_SOURCE, description: 'Budget plans, monthly cancellable.' },
    { slug: 'biber', name: 'Biber Mobile', legalName: 'Biber Mobile GmbH (fictional)', logo: img('providers/biber.svg'), rating: 4.0, ratingSource: RATING_SOURCE, description: 'Large data plans on 5G.' },
];

// Postcode prefixes where the fictional fiber and cable networks are available
const FIBER_AREAS = ['10', '12', '13', '20', '21', '22'];
const CABLE_AREAS = ['10', '12', '20', '22', '50', '51', '60', '80', '81'];
const NATIONWIDE = { nationwide: true, postcodePrefixes: [] };

// providerSlug is replaced with the provider's ID by the seed script
const homeTariffs = [
    { externalId: 'elbstrom-gf500', providerSlug: 'elbstrom', name: 'Glasfaser 500', connectionType: 'Fiber', downloadMbps: 500, uploadMbps: 250, termMonths: 24, monthlyPrice: 29.99, promoMonths: 12, regularPrice: 49.99, coverage: { nationwide: false, postcodePrefixes: FIBER_AREAS } },
    { externalId: 'elbstrom-gf1000', providerSlug: 'elbstrom', name: 'Glasfaser 1000', connectionType: 'Fiber', downloadMbps: 1000, uploadMbps: 500, termMonths: 24, monthlyPrice: 44.99, promoMonths: 12, regularPrice: 69.99, coverage: { nationwide: false, postcodePrefixes: FIBER_AREAS } },
    { externalId: 'kranich-k250', providerSlug: 'kranich', name: 'Kabel 250', connectionType: 'Cable', downloadMbps: 250, uploadMbps: 25, termMonths: 24, monthlyPrice: 19.99, promoMonths: 6, regularPrice: 39.99, setupFee: 49.99, bonus: 100, coverage: { nationwide: false, postcodePrefixes: CABLE_AREAS } },
    { externalId: 'kranich-k1000', providerSlug: 'kranich', name: 'Kabel 1000', connectionType: 'Cable', downloadMbps: 1000, uploadMbps: 50, termMonths: 24, monthlyPrice: 39.99, promoMonths: 6, regularPrice: 59.99, setupFee: 49.99, bonus: 100, coverage: { nationwide: false, postcodePrefixes: CABLE_AREAS } },
    { externalId: 'spreewelle-vdsl100', providerSlug: 'spreewelle', name: 'VDSL 100', connectionType: 'VDSL', downloadMbps: 100, uploadMbps: 40, termMonths: 24, monthlyPrice: 39.99, setupFee: 69.99, coverage: NATIONWIDE },
    { externalId: 'spreewelle-dsl16', providerSlug: 'spreewelle', name: 'DSL 16 Flex', connectionType: 'DSL', downloadMbps: 16, uploadMbps: 2.4, termMonths: 1, monthlyPrice: 29.99, setupFee: 69.99, coverage: NATIONWIDE },
    { externalId: 'isarlink-vdsl50', providerSlug: 'isarlink', name: 'VDSL 50 Flex', connectionType: 'VDSL', downloadMbps: 50, uploadMbps: 10, termMonths: 1, monthlyPrice: 36.99, hardwareFee: 99, coverage: NATIONWIDE },
    { externalId: 'isarlink-vdsl250', providerSlug: 'isarlink', name: 'VDSL 250', connectionType: 'VDSL', downloadMbps: 250, uploadMbps: 40, termMonths: 12, monthlyPrice: 47.99, setupFee: 29.99, coverage: NATIONWIDE },
    { externalId: 'alpenfunk-lte50', providerSlug: 'alpenfunk', name: 'LTE Home 50', connectionType: 'LTE', downloadMbps: 50, uploadMbps: 10, termMonths: 1, monthlyPrice: 39.99, hardwareFee: 49.99, coverage: NATIONWIDE },
];

const mobileTariffs = [
    { externalId: 'moewe-prepaid-s', providerSlug: 'moewe', name: 'Prepaid S', contractType: 'prepaid', network: '4G', dataGB: 5, minutes: null, termMonths: 1, monthlyPrice: 7.99, setupFee: 9.99 },
    { externalId: 'moewe-prepaid-l', providerSlug: 'moewe', name: 'Prepaid L', contractType: 'prepaid', network: '4G', dataGB: 25, minutes: null, termMonths: 1, monthlyPrice: 14.99, setupFee: 9.99 },
    { externalId: 'fuchs-allnet20', providerSlug: 'fuchs', name: 'Allnet 20', contractType: 'contract', network: '5G', dataGB: 20, minutes: null, termMonths: 24, monthlyPrice: 12.99, setupFee: 39.99 },
    { externalId: 'fuchs-allnet50', providerSlug: 'fuchs', name: 'Allnet 50', contractType: 'contract', network: '5G', dataGB: 50, minutes: null, termMonths: 24, monthlyPrice: 9.99, promoMonths: 6, regularPrice: 19.99, setupFee: 39.99 },
    { externalId: 'fuchs-unlimited', providerSlug: 'fuchs', name: 'Unlimited', contractType: 'contract', network: '5G', dataGB: null, minutes: null, termMonths: 24, monthlyPrice: 49.99, setupFee: 39.99, bonus: 120 },
    { externalId: 'igel-flex10', providerSlug: 'igel', name: 'Flex 10', contractType: 'contract', network: '4G', dataGB: 10, minutes: null, termMonths: 1, monthlyPrice: 9.99, setupFee: 19.99 },
    { externalId: 'igel-basic300', providerSlug: 'igel', name: 'Basic 300', contractType: 'prepaid', network: '4G', dataGB: 3, minutes: 300, termMonths: 1, monthlyPrice: 4.99, setupFee: 9.99 },
    { externalId: 'biber-max100', providerSlug: 'biber', name: '5G Max 100', contractType: 'contract', network: '5G', dataGB: 100, minutes: null, termMonths: 12, monthlyPrice: 29.99 },
];

module.exports = {
    STATES,
    providers,
    data: {
        AutoRepair: autoRepairs,
        MotorcycleRepair: motorcycleRepairs,
        ApplianceRepair: applianceRepairs,
        MobileRepair: mobileRepairs,
        ComputerRepair: computerRepairs,
        GardenSupplies: gardenSupplies,
        AnimalBasedProducts: animalBasedProducts,
        DentalService: dentalServices,
        Bookstore: bookstores,
        EduCenter: educationCenters,
        MenSalonPlan: menSalons,
        WomenSalonPlan: womenSalons,
        HomeTariff: homeTariffs,
        MobileTariff: mobileTariffs,
    },
};
