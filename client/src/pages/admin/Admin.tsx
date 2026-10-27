import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Seo from "@/components/common/Seo";
import { AuthContext } from "@/context/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { ListingResponse, OfferType, ReviewType } from "@/types";
import { formatPrice } from "@/utils/helpers";
import ResourceAdmin, { Column, Field } from "./ResourceAdmin";

// The admin area is English-only
const TERM_OPTIONS = [
  { value: "1", label: "1 month (cancellable monthly)" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

const OFFER_FIELDS: Field[] = [
  { name: "providerId", label: "Provider", type: "provider", required: true },
  { name: "name", label: "Plan name", type: "text", required: true },
  { name: "externalId", label: "External ID", type: "text", hint: "ID in the partner feed; used by the import" },
  { name: "termMonths", label: "Minimum term", type: "select", options: TERM_OPTIONS, required: true },
  { name: "monthlyPrice", label: "Monthly price (€)", type: "number", required: true, hint: "During the promo period, if any" },
  { name: "promoMonths", label: "Promo months", type: "number" },
  { name: "regularPrice", label: "Price after promo (€)", type: "nullableNumber", hint: "Empty if the price never changes" },
  { name: "setupFee", label: "Setup fee (€)", type: "number" },
  { name: "hardwareFee", label: "Hardware fee (€)", type: "number" },
  { name: "bonus", label: "Bonus / cashback (€)", type: "number" },
  { name: "affiliateUrl", label: "Affiliate URL", type: "text" },
  { name: "validFrom", label: "Valid from", type: "date" },
  { name: "validUntil", label: "Valid until", type: "date" },
  { name: "active", label: "Active (shown to visitors)", type: "checkbox" },
];

const HOME_FIELDS: Field[] = [
  ...OFFER_FIELDS.slice(0, 3),
  {
    name: "connectionType",
    label: "Connection type",
    type: "select",
    required: true,
    options: ["DSL", "VDSL", "Cable", "Fiber", "LTE"].map((value) => ({ value, label: value })),
  },
  { name: "downloadMbps", label: "Download (Mbit/s)", type: "number", required: true },
  { name: "uploadMbps", label: "Upload (Mbit/s)", type: "number", required: true },
  { name: "coverage.nationwide", label: "Available nationwide", type: "checkbox" },
  { name: "coverage.postcodePrefixes", label: "Postcode prefixes", type: "list", hint: "If not nationwide, e.g. 10, 12, 20" },
  ...OFFER_FIELDS.slice(3),
];

const MOBILE_FIELDS: Field[] = [
  ...OFFER_FIELDS.slice(0, 3),
  {
    name: "contractType",
    label: "Plan type",
    type: "select",
    required: true,
    options: [
      { value: "prepaid", label: "Prepaid" },
      { value: "contract", label: "Contract" },
    ],
  },
  {
    name: "network",
    label: "Network",
    type: "select",
    required: true,
    options: [
      { value: "5G", label: "5G" },
      { value: "4G", label: "4G" },
    ],
  },
  { name: "dataGB", label: "Data (GB)", type: "nullableNumber", hint: "Empty = unlimited" },
  { name: "minutes", label: "Minutes", type: "nullableNumber", hint: "Empty = unlimited" },
  ...OFFER_FIELDS.slice(3),
];

const PROVIDER_FIELDS: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, hint: "Lowercase, e.g. my-provider" },
  { name: "logo", label: "Logo", type: "text", hint: "Full URL, or a path under uploads/" },
  { name: "website", label: "Website", type: "text" },
  { name: "legalName", label: "Company name", type: "text" },
  { name: "imprintUrl", label: "Imprint URL", type: "text" },
  { name: "rating", label: "Editorial rating (0–5)", type: "number" },
  { name: "ratingSource", label: "Rating source", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

const offerColumns: Column[] = [
  { label: "Provider", value: (item) => String(item.provider ?? "") },
  { label: "Plan", value: (item) => String(item.name) },
  { label: "Effective / month", value: (item) => formatPrice(Number(item.effectiveMonthlyPrice)) },
  {
    label: "Last checked",
    value: (item) => (item.lastCheckedAt ? new Date(String(item.lastCheckedAt)).toLocaleDateString() : "–"),
  },
];

const providerColumns: Column[] = [
  { label: "Name", value: (item) => String(item.name) },
  { label: "Slug", value: (item) => String(item.slug) },
  { label: "Rating", value: (item) => (item.rating !== undefined ? String(item.rating) : "–") },
];

function ReviewModeration() {
  const auth = useContext(AuthContext);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const load = useCallback(() => {
    apiFetch<{ reviews: ReviewType[] }>(`/api/reviews/moderation?status=${status}`, { token: auth.token }).then(
      (data) => setReviews(data.reviews)
    );
  }, [status, auth.token]);
  useEffect(load, [load]);

  async function setReviewStatus(id: string, next: string) {
    await apiFetch(`/api/reviews/${id}`, { method: "PATCH", token: auth.token, body: { status: next } });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["pending", "approved", "rejected"] as const).map((value) => (
          <Button key={value} size="sm" variant={status === value ? "default" : "outline"} onClick={() => setStatus(value)}>
            {value}
          </Button>
        ))}
      </div>
      {reviews.length === 0 && <p className="text-sm text-gray-500">No {status} reviews.</p>}
      {reviews.map((review) => (
        <Card key={review._id} className="p-4 space-y-2">
          <p className="text-sm text-gray-500">
            {review.provider?.name} · {review.authorName} · {"★".repeat(review.rating)} ·{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
          {review.title && <p className="font-semibold">{review.title}</p>}
          <p className="text-sm whitespace-pre-line">{review.text}</p>
          <div className="flex gap-2">
            {status !== "approved" && (
              <Button size="sm" onClick={() => setReviewStatus(review._id, "approved")}>
                Approve
              </Button>
            )}
            {status !== "rejected" && (
              <Button size="sm" variant="outline" onClick={() => setReviewStatus(review._id, "rejected")}>
                Reject
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ClickStats() {
  const auth = useContext(AuthContext);
  const [rows, setRows] = useState<{ name: string; type: string; clicks: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<{ stats: { offer: string; offerType: string; clicks: number }[] }>("/api/go/stats?days=30", { token: auth.token }),
      apiFetch<ListingResponse<OfferType>>("/api/internet/home-tariffs?includeInactive=true&limit=100", { token: auth.token }),
      apiFetch<ListingResponse<OfferType>>("/api/internet/mobile-tariffs?includeInactive=true&limit=100", { token: auth.token }),
    ])
      .then(([stats, home, mobile]) => {
        const names = new Map([...home.items, ...mobile.items].map((offer) => [offer._id, `${offer.provider} ${offer.name}`]));
        setRows(stats.stats.map((row) => ({ name: names.get(row.offer) ?? row.offer, type: row.offerType, clicks: row.clicks })));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : String(err)));
  }, [auth.token]);

  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <Card className="p-0">
      <table className="w-full text-sm">
        <caption className="text-left p-3 font-medium">"Go to offer" clicks, last 30 days</caption>
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3 font-medium">Offer</th>
            <th className="p-3 font-medium">Type</th>
            <th className="p-3 font-medium text-right">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="p-3 text-gray-500" colSpan={3}>No clicks yet.</td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={`${row.type}-${row.name}`} className="border-t">
              <td className="p-3">{row.name}</td>
              <td className="p-3">{row.type}</td>
              <td className="p-3 text-right">{row.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

const TABS = [
  { id: "home", label: "Home internet" },
  { id: "mobile", label: "Mobile plans" },
  { id: "providers", label: "Providers" },
  { id: "reviews", label: "Reviews" },
  { id: "clicks", label: "Clicks" },
] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("home");

  return (
    <div className="max-w-6xl mx-auto mt-6 space-y-4">
      <Seo title="Admin" />
      <meta name="robots" content="noindex" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-xs text-gray-500">
          Bulk updates: <code>npm run import -- feed.json</code> in <code>server/</code>.{" "}
          <Link to="/" className="text-blue-700 hover:underline">Back to site</Link>
        </p>
      </div>
      <div role="tablist" className="flex flex-wrap gap-2 border-b pb-2">
        {TABS.map(({ id, label }) => (
          <Button key={id} role="tab" aria-selected={tab === id} size="sm" variant={tab === id ? "default" : "outline"} onClick={() => setTab(id)}>
            {label}
          </Button>
        ))}
      </div>
      {tab === "home" && (
        <ResourceAdmin key="home" endpoint="/api/internet/home-tariffs" fields={HOME_FIELDS} columns={offerColumns} sort="provider" hasActive />
      )}
      {tab === "mobile" && (
        <ResourceAdmin key="mobile" endpoint="/api/internet/mobile-tariffs" fields={MOBILE_FIELDS} columns={offerColumns} sort="provider" hasActive />
      )}
      {tab === "providers" && (
        <ResourceAdmin key="providers" endpoint="/api/providers" fields={PROVIDER_FIELDS} columns={providerColumns} sort="name" />
      )}
      {tab === "reviews" && <ReviewModeration />}
      {tab === "clicks" && <ClickStats />}
    </div>
  );
}
