import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { CompareProvider } from "@/context/CompareProvider";
import { SavedOffersProvider } from "@/context/SavedOffersProvider";

type StoredUser = {
  userId: string;
  fullName: string;
  username: string;
  role: string;
  token: string;
  expiration: string;
};

// Read the saved login synchronously, so protected pages don't redirect on reload
function loadStoredUser(): StoredUser | null {
  try {
    const stored = localStorage.getItem("userData");
    if (!stored) return null;
    const parsed: StoredUser = JSON.parse(stored);
    if (parsed.token && new Date(parsed.expiration) > new Date()) {
      return parsed;
    }
    localStorage.removeItem("userData");
  } catch (err) {
    console.error("Failed to parse user data:", err);
  }
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(loadStoredUser);

  const login = useCallback(function (
    uid: string,
    fullName: string,
    username: string,
    role: string,
    token: string,
    expirationDate?: Date
  ) {
    const expiration =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    const data = {
      userId: uid,
      fullName,
      username,
      role,
      token,
      expiration: expiration.toISOString(),
    };
    setUser(data);
    localStorage.setItem("userData", JSON.stringify(data));
  },
  []);

  const logout = useCallback(function () {
    setUser(null);
    localStorage.removeItem("userData");
  }, []);

  // Log out automatically when the token expires
  useEffect(() => {
    if (!user) return;
    const remainingTime = new Date(user.expiration).getTime() - Date.now();
    const timer = setTimeout(logout, Math.max(0, remainingTime));
    return () => clearTimeout(timer);
  }, [user, logout]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        token: user?.token ?? null,
        userId: user?.userId ?? null,
        fullName: user?.fullName ?? null,
        username: user?.username ?? null,
        role: user?.role ?? null,
        login,
        logout,
      }}
    >
      <SavedOffersProvider>
        <CompareProvider>{children}</CompareProvider>
      </SavedOffersProvider>
    </AuthContext.Provider>
  );
}
