import React, { useContext, useState } from "react";
import { Toaster } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/common/Container";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useHttpClient } from "@/hooks/http-hook";
import { AuthContext } from "@/context/auth-context";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest } = useHttpClient();

  // State to manage form data
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.repeatPassword) {
      setPasswordError("رمزهای عبور مطابقت ندارند");
      return;
    }

    setPasswordError("");

    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
        },
        "حساب کاربری شما با موفقیت ایجاد شد "
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
  }

  return (
    <Container>
      {isLoading && <LoadingSpinner asOverlay />}
      <Toaster position="top-center" richColors />
      <div className="min-h-[50vh] flex items-start justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">ثبت‌ نام</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* User Name */}
              <div className="mb-4">
                <Label htmlFor="username">
                  نام کاربری <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <Label htmlFor="fullName">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <Label htmlFor="email">
                  ایمیل<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4 relative">
                <Label htmlFor="password">
                  رمز عبور<span className="text-red-500">*</span>
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  placeholder="رمز عبور باید حداقل 6 حرف باشد"
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute left-3 top-8 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </span>
              </div>

              {/* Repeat Password */}
              <div className="mb-4 relative">
                <Label htmlFor="repeatPassword">
                  تکرار رمز عبور<span className="text-red-500">*</span>
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="repeatPassword"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  placeholder="رمز عبور باید حداقل 6 حرف باشد"
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute left-3 top-8 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </span>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              {/* Submit Button */}
              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  ثبت‌ نام
                </Button>
              </div>
            </form>

            <p className="text-sm text-center mt-4 text-gray-600">
              آیا قبلاً حساب کاربری دارید؟
              <Link
                to="/login"
                className="text-indigo-600 hover:underline focus:outline-none"
              >
                ورود
              </Link>
            </p>
            {error && <p className="text-center text-red-500 mb-8">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
