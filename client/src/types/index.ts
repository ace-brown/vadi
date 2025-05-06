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
