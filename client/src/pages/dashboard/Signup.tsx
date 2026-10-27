import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Seo from "@/components/common/Seo";
import { AuthContext } from "@/context/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthResponse } from "./Login";

export default function SignupPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const { username, fullName, email, password } = formData;
      const data = await apiFetch<AuthResponse>("/api/users/signup", {
        method: "POST",
        body: { username, fullName, email, password },
      });
      auth.login(data.userId, data.fullName, data.username, data.role, data.token);
      toast.success(t("auth.accountCreated"));
      navigate("/account");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
      setIsLoading(false);
    }
  }

  const fields: { name: keyof typeof formData; label: string; type: string; autoComplete: string }[] = [
    { name: "username", label: t("auth.username"), type: "text", autoComplete: "username" },
    { name: "fullName", label: t("auth.fullName"), type: "text", autoComplete: "name" },
    { name: "email", label: t("auth.email"), type: "email", autoComplete: "email" },
  ];

  return (
    <div className="min-h-[50vh] flex items-start justify-center mt-10">
      <Seo title={t("auth.signup")} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t("auth.signup")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            {(["password", "repeatPassword"] as const).map((name) => (
              <div key={name} className="space-y-2 relative">
                <Label htmlFor={name}>{name === "password" ? t("auth.password") : t("auth.repeatPassword")}</Label>
                <Input
                  id={name}
                  name={name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={6}
                  placeholder={t("auth.minChars")}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
            ))}
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {t("auth.signup")}
            </Button>
          </form>
          <p className="text-sm text-center mt-4 text-gray-600">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-blue-700 hover:underline">
              {t("auth.login")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
