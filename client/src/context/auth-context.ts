import { createContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  userId: string | null;
  fullName: string | null;
  username: string | null;
  role: string | null;
  login: (
    uid: string,
    fullName: string,
    username: string,
    role: string,
    token: string,
    expirationDate?: Date
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  token: null,
  fullName: null,
  username: null,
  role: null,
  login: () => {},
  logout: () => {},
});
