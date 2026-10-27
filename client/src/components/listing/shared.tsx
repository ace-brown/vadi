import { useState } from "react";
import { ImageOff, MapPin, Star } from "lucide-react";
import { imageUrl } from "@/utils/helpers";

export function CardImage({
  src,
  alt,
  contain = false,
}: {
  src?: string;
  alt: string;
  contain?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const url = imageUrl(src);

  if (!url || failed) {
    return (
      <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
        <ImageOff className="w-6 h-6" />
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-lg ${
        contain ? "object-contain" : "object-cover"
      }`}
    />
  );
}

export function Rating({ value }: { value?: number }) {
  if (value === undefined || value === null) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-sm font-medium text-amber-600"
      aria-label={`Rated ${value} out of 5`}
    >
      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </span>
  );
}

export function Address({ address }: { address: string }) {
  return (
    <p className="flex items-start gap-1 text-sm text-gray-500">
      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{address}</span>
    </p>
  );
}

export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
