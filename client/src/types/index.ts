export interface SearchType {
  id: number;
  name: string;
  type: "mobile" | "internet" | "barber";
}

export interface UserType {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  createdAt?: string;
  reports?: string[];
  ideas?: string[];
  profile: {
    fullName: string;
    bio?: string;
    avatar?: string;
  };
  settings?: {
    language?: "de" | "en";
    notifications?: boolean;
  };
}

// The shape of every list endpoint: GET /api/<category>?<filters>
export type Range = { min: number | null; max: number | null };

export interface ListingResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  ranges: Record<string, Range>;
  // Counts per value of each facet field, e.g. { connectionType: { Fiber: 2, VDSL: 3 } }
  facets?: Record<string, Record<string, number>>;
}

export interface ProviderType {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  legalName?: string;
  imprintUrl?: string;
  description?: string;
  rating?: number;
  ratingSource?: string;
}

// Fields shared by home internet and mobile offers
export interface OfferType {
  _id: string;
  providerId: ProviderType; // populated by the API
  provider: string;
  name: string;
  termMonths: number;
  monthlyPrice: number;
  promoMonths: number;
  regularPrice: number | null;
  setupFee: number;
  hardwareFee: number;
  bonus: number;
  totalCost24: number;
  effectiveMonthlyPrice: number;
  previousEffectiveMonthlyPrice?: number | null;
  priceChangedAt?: string | null;
  // Vadi score: 1.0 (best) to 5.0, and its parts (0–100)
  score?: number | null;
  scoreDetails?: { price: number; performance: number; flexibility: number; provider: number } | null;
  affiliateUrl?: string | null;
  active: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
  lastCheckedAt?: string | null;
  updatedAt?: string;
}

export interface MobilePlanType extends OfferType {
  contractType: "prepaid" | "contract";
  network: "4G" | "5G";
  dataGB: number | null; // null means unlimited
  minutes: number | null; // null means unlimited
}

export interface HomePlanType extends OfferType {
  connectionType: "DSL" | "VDSL" | "Cable" | "Fiber" | "LTE";
  downloadMbps: number;
  uploadMbps: number;
  coverage: { nationwide: boolean; postcodePrefixes: string[] };
}

export type OfferKind = "home" | "mobile";

export interface ReviewType {
  _id: string;
  authorName: string;
  rating: number;
  title?: string;
  text: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
  provider?: { _id: string; name: string };
}

// A physical place: repair shop, clinic, bookstore, salon...
export interface PlaceType {
  _id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  rating?: number;
  image?: string;
}

export interface ServicePlaceType extends PlaceType {
  services: string[];
}

export type MenSalonType = PlaceType & {
  haircutPrice: number;
  menLiftPrice: number;
  groomMakeupPrice: number;
  curlyHairDoPrice: number;
};

export type WomenSalonType = PlaceType & {
  faceCarePrice: number;
  hairBotoxPrice: number;
  hairColorPrice: number;
  makeupPrice: number;
  eyelashExtensionPrice: number;
  eyebrowShapePrice: number;
  eyebrowLiftPrice: number;
  nailExtensionPrice: number;
  manicurePrice: number;
  waxingPrice: number;
};
