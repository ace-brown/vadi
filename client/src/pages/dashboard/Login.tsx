import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Seo from "@/components/common/Seo";
import { AuthContext } from "@/context/auth-context";
import { apiFetch, ApiError } from "@/lib/api";

export type AuthResponse = {
  userId: string;
  fullName: string;
  username: string;
  role: string;
  token: string;
};

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // Set by RequireAuth when a protected page sent the user here
  const from = (location.state as { from?: string } | null)?.from;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await apiFetch<AuthResponse>("/api/users/login", {
        method: "POST",
        body: { email, password },
      });
      auth.login(data.userId, data.fullName, data.username, data.role, data.token);
      toast.success(t("auth.loggedIn"));
      navigate(from ?? (data.role === "admin" ? "/admin" : "/account"), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[50vh] flex items-start justify-center mt-10">
      <Seo title={t("auth.login")} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t("auth.login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                type="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {t("auth.login")}
            </Button>
          </form>
          <p className="text-sm text-center mt-4 text-gray-600">
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="text-blue-700 hover:underline">
              {t("auth.signup")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
