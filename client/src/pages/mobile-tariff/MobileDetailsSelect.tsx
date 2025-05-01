import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MobileTariffDetailsSelectPage() {
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(Number(e.target.value));
  }

  function handleDuration(e: React.ChangeEvent<HTMLInputElement>) {
    setDuration(Number(e.target.value));
  }

  function handleSubmit() {
    const searchParams = new URLSearchParams();
    searchParams.set("volume", volume.toString());
    searchParams.set("duration", duration.toString());
    navigate(`/mobile-details-grids?${searchParams.toString()}`);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="data-volume">نوع سیم‌کارت</Label>
            <Input
              type="number"
              onChange={handleVolume}
              id="data-volume"
              placeholder="نوع سیم‌کارت را وارد کنید"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration"></Label>
            <Input
              type="number"
              onChange={handleDuration}
              id="duration"
              placeholder="مدت زمان را وارد کنید"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full mt-4">
            مقایسه
          </Button>
        </CardContent>
      </Card>
      <p className="text-center mt-6 text-sm text-gray-600">
        اینجا یک متن نمونه به زبان فارسی قرار دارد که توضیحات بیشتری می‌تواند
        ارائه دهد.
      </p>
    </div>
  );
}
