import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";

let logoutTimer: NodeJS.Timeout | null = null;

export function Providers({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(
    null
  );
  // const navigate = useNavigate();

  const login = useCallback(function (
    uid: string,
    fullName: string,
    username: string,
    role: string,
    token: string,
    expirationDate?: Date
  ) {
    setToken(token);
    setUserId(uid);
    setFullName(fullName);
    setUsername(username);
    setRole(role);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        fullName: fullName,
        username: username,
        role: role,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  },
  []);

  const logout = useCallback(function () {
    // navigate("/");
    setToken(null);
    setUserId(null);
    setFullName(null);
    setUsername(null);
    setTokenExpirationDate(null);
    setRole(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    }
  }, [token, logout, tokenExpirationDate]);

  // Load user data from local storage on page load or if token changes
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsedData: {
          userId: string;
          fullName: string;
          username: string;
          role: string;
          token: string;
          expiration: string;
        } = JSON.parse(storedData);

        if (parsedData.token && new Date(parsedData.expiration) > new Date()) {
          login(
            parsedData.userId,
            parsedData.fullName,
            parsedData.username,
            parsedData.role,
            parsedData.token,
            new Date(parsedData.expiration)
          );
        }
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        fullName: fullName,
        username: username,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
