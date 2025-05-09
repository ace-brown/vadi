"use client";

import React, { useContext, useState } from "react";
import { Toaster } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/common/container";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useHttpClient } from "@/hooks/http-hook";
import { AuthContext } from "@/context/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, sendRequest, error } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/users/login`,
        "POST",
        JSON.stringify({ email, password }),
        {
          "Content-Type": "application/json",
        },
        "با موفقیت وارد شدید"
      );
      auth.login(
        responseData.userId,
        responseData.fullName,
        responseData.username,
        responseData.role,
        responseData.token
      );
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  };

  return (
    <Container>
      {isLoading && <LoadingSpinner asOverlay />}
      <Toaster position="top-center" richColors />
      <div className="min-h-[50vh] flex items-start justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">ورود</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <Label htmlFor="email">
                  ایمیل<span className="text-red-500">*</span>
                </Label>
                <Input
                  className="mt-4"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <Label htmlFor="password">
                  رمز عبور<span className="text-red-500">*</span>
                </Label>
                <Input
                  className="mt-4"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  ورود
                </Button>
              </div>
            </form>

            <p className="text-sm text-center mt-4 text-gray-600">
              حساب کاربری ندارید؟{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:underline focus:outline-none"
              >
                ثبت‌ نام
              </Link>
            </p>
            {error && <p className="text-center text-red-500 mb-8">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
