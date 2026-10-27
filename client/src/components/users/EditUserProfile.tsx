import React, { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useHttpClient } from "@/hooks/http-hook";
import { AuthContext } from "@/context/auth-context";
import { UserType } from "@/types";

type EditUserProfileType = {
  profileData: UserType | undefined;
  setProfileData: React.Dispatch<React.SetStateAction<UserType | undefined>>;
  closeDialog: () => void;
};
export default function EditUserProfile({
  profileData,
  setProfileData,
  closeDialog,
}: EditUserProfileType) {
  const { isLoading, error, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;

  const [formData, setFormData] = useState({
    fullName: profileData?.profile.fullName || "",
    username: profileData?.username || "",
    email: profileData?.email || "",
    bio: profileData?.profile.bio || "",
    password: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Update profile handler
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        "PATCH",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        "Profile updated successfully"
      );
      setProfileData(responseData.user);
      closeDialog();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  return (
    <div className="w-[500px]">
      <div>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About me</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New password (leave empty to keep it)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            Update profile
          </Button>
        </form>
      </div>
    </div>
  );
}
