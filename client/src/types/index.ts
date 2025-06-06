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

export interface MobileNetType {
  type: string;
  simPrice: number;
  validity: string;
  packagePrice: number;
  minutes: number;
  image?: string;
}

export interface HomeNetType {
  title: string;
  speed: string;
  duration: string;
  volume: string;
  netType: string;
  price: number;
  image?: string;
}

export type MenSalonPlansType = {
  title: string;
  haircutPrice: number;
  menLiftPrice: number;
  groomMakeupPrice: number;
  curlyHairDoPrice: number;
  image?: string;
};

export type WomenSalonPlansType = {
  title: string;
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
  image?: string;
};

export type AutoRepairType = {
  title?: string;
  address?: string;
  services?: string[];
  image?: string;
  onShowModal?: (value: boolean) => void;
};
