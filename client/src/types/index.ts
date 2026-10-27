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
    language?: "en" | "fa";
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
}

export interface MobilePlanType {
  _id: string;
  provider: string;
  name: string;
  contractType: "prepaid" | "contract";
  network: "4G" | "5G";
  dataGB: number | null; // null means unlimited
  minutes: number | null; // null means unlimited
  termMonths: number;
  monthlyPrice: number;
  setupFee: number;
  image?: string;
}

export interface HomePlanType {
  _id: string;
  provider: string;
  name: string;
  connectionType: "DSL" | "VDSL" | "Cable" | "Fiber" | "LTE";
  downloadMbps: number;
  uploadMbps: number;
  termMonths: number;
  monthlyPrice: number;
  setupFee: number;
  image?: string;
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
