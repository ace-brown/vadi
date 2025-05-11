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

export interface SimCardInfoType {
  type: string;
  simPrice: string;
  validity: string;
  packagePrice: string;
  minutes: string;
  image: string;
}

export interface HomeNetType {
  title: string;
  speed: string;
  duration: string;
  volume: string;
  netType: string;
  price: number;
  image: string;
}

export interface BarberPlansType {
  title: string;
  haircutPrice: number;
  menLift: string;
  groomMakeup: string;
  curlyHairDo: string;
  image: string;
}
