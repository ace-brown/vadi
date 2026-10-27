import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Bookmark, Columns3, MessageSquare, TrendingDown, TrendingUp, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Seo from "@/components/common/Seo";
import { CardImage, Rating } from "@/components/listing/shared";
import { GoToOfferButton } from "@/components/offers/OfferCard";
import { AuthContext } from "@/context/auth-context";
import { CompareContext } from "@/context/compare-context";
import { SavedOffersContext } from "@/context/saved-offers-context";
import { apiFetch, ApiError } from "@/lib/api";
import { OfferKind, OfferType, ReviewType, UserType } from "@/types";
import { formatDate, formatPrice } from "@/utils/helpers";

const TABS = ["saved", "comparisons", "reviews", "profile"] as const;
type Tab = (typeof TABS)[number];

const RESULTS_PATHS: Record<OfferKind, string> = {
  home: "/internet/home-tariff",
  mobile: "/internet/mobile-tariff",
};

function useAuthedApi<T>(path: string) {
  const auth = useContext(AuthContext);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    apiFetch<T>(path, { token: auth.token })
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : String(err)));
  }, [path, auth.token, reloadKey]);

  return { data, error, reload: () => setReloadKey((key) => key + 1) };
}

function EmptyState({ text }: { text: string }) {
  const { t } = useTranslation();
  return (
    <div className="text-center py-10 space-y-3 text-gray-600">
      <p>{text}</p>
      <div className="flex justify-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to={RESULTS_PATHS.home}>{t("nav.homeInternet")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={RESULTS_PATHS.mobile}>{t("nav.mobilePlans")}</Link>
        </Button>
      </div>
    </div>
  );
}

// ---------- Watchlist ----------

type SavedItem = {
  kind: OfferKind;
  offerId: string;
  savedPrice: number;
  savedAt: string;
  offer: OfferType | null;
  available: boolean;
};

function PriceChange({ saved, current }: { saved: number; current: number }) {
  const { t } = useTranslation();
  const difference = Math.round((current - saved) * 100) / 100;
  if (difference === 0) return <span className="text-xs text-gray-500">{t("account.priceSame")}</span>;
  const cheaper = difference < 0;
  const Icon = cheaper ? TrendingDown : TrendingUp;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${cheaper ? "text-emerald-700" : "text-red-600"}`}>
      <Icon className="w-4 h-4" />
      {t(cheaper ? "account.priceDown" : "account.priceUp", { amount: formatPrice(Math.abs(difference)) })}
    </span>
  );
}

function Watchlist() {
  const { t } = useTranslation();
  const { toggleSaved } = useContext(SavedOffersContext);
  const { data, error, reload } = useAuthedApi<{ items: SavedItem[] }>("/api/me/saved-offers");

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-gray-500">{t("common.loading")}</p>;
  if (data.items.length === 0) return <EmptyState text={t("account.savedEmpty")} />;

  return (
    <ul className="space-y-3">
      {data.items.map((item) => (
        <li key={item.offerId}>
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex gap-4 flex-1 min-w-0">
                <CardImage src={item.offer?.providerId?.logo} alt={`${item.offer?.provider ?? ""} logo`} contain />
                <div className="min-w-0 space-y-1">
                  {item.offer ? (
                    <>
                      <p className="flex items-center gap-2 text-sm text-gray-500">
                        {item.offer.provider}
                        <Rating value={item.offer.providerId?.rating} />
                      </p>
                      <Link to={`${RESULTS_PATHS[item.kind]}/${item.offerId}`} className="font-bold hover:underline">
                        {item.offer.name}
                      </Link>
                    </>
                  ) : (
                    <p className="font-medium text-gray-500">{t("account.offerGone")}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {t("account.savedOn", { date: formatDate(item.savedAt), price: formatPrice(item.savedPrice) })}
                  </p>
                  {item.offer && item.available && (
                    <PriceChange saved={item.savedPrice} current={item.offer.effectiveMonthlyPrice} />
                  )}
                  {item.offer && !item.available && <Badge variant="outline">{t("account.unavailable")}</Badge>}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-2">
                {item.offer && (
                  <p className="text-xl font-extrabold">
                    {formatPrice(item.offer.effectiveMonthlyPrice)}
                    <span className="text-xs font-normal text-gray-500"> {t("common.perMonth")}</span>
                  </p>
                )}
                <div className="flex items-center gap-3">
                  {item.offer && item.available && <GoToOfferButton kind={item.kind} offer={item.offer} />}
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-red-600"
                    onClick={async () => {
                      await toggleSaved(item.kind, item.offerId);
                      reload();
                    }}
                  >
                    {t("account.remove")}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

// ---------- Saved comparisons ----------

type SavedComparison = {
  _id: string;
  kind: OfferKind;
  name?: string;
  createdAt: string;
  offers: { _id: string; name: string | null; provider: string | null; effectiveMonthlyPrice: number | null; available: boolean }[];
};

function Comparisons() {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { replace } = useContext(CompareContext);
  const navigate = useNavigate();
  const { data, error, reload } = useAuthedApi<{ items: SavedComparison[] }>("/api/me/comparisons");

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-gray-500">{t("common.loading")}</p>;
  if (data.items.length === 0) return <EmptyState text={t("account.comparisonsEmpty")} />;

  async function remove(id: string) {
    await apiFetch(`/api/me/comparisons/${id}`, { method: "DELETE", token: auth.token });
    reload();
  }

  return (
    <ul className="space-y-3">
      {data.items.map((comparison) => {
        const availableIds = comparison.offers.filter((offer) => offer.available).map((offer) => offer._id);
        return (
          <li key={comparison._id}>
            <Card className="p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {comparison.name || (comparison.kind === "home" ? t("nav.homeInternet") : t("nav.mobilePlans"))}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(comparison.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    disabled={availableIds.length === 0}
                    onClick={() => {
                      replace(comparison.kind, availableIds);
                      navigate(`/compare/${comparison.kind}`);
                    }}
                  >
                    {t("account.open")}
                  </Button>
                  <button type="button" className="text-sm text-gray-600 hover:text-red-600" onClick={() => remove(comparison._id)}>
                    {t("account.remove")}
                  </button>
                </div>
              </div>
              <ul className="grid gap-2 sm:grid-cols-3">
                {comparison.offers.map((offer) => (
                  <li key={offer._id} className={`rounded-lg border px-3 py-2 text-sm ${offer.available ? "bg-gray-50" : "bg-gray-50 text-gray-400"}`}>
                    {offer.name ? (
                      <>
                        <span className="block text-xs text-gray-500">{offer.provider}</span>
                        <span className="font-medium">{offer.name}</span>
                        {offer.effectiveMonthlyPrice !== null && (
                          <span className="block">{formatPrice(offer.effectiveMonthlyPrice)} {t("common.perMonth")}</span>
                        )}
                        {!offer.available && <span className="block text-xs">{t("account.unavailable")}</span>}
                      </>
                    ) : (
                      t("account.offerGone")
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

// ---------- My reviews ----------

function MyReviews() {
  const { t } = useTranslation();
  const { data, error } = useAuthedApi<{ reviews: ReviewType[] }>("/api/me/reviews");

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-gray-500">{t("common.loading")}</p>;
  if (data.reviews.length === 0) return <EmptyState text={t("account.reviewsEmpty")} />;

  const statusStyles = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    rejected: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <ul className="space-y-3">
      {data.reviews.map((review) => (
        <li key={review._id}>
          <Card className="p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{review.provider?.name}</span>
              <span className="text-amber-500" aria-label={t("reviews.stars", { count: review.rating })}>
                {"★".repeat(review.rating)}
                <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
              </span>
              {review.status && (
                <Badge variant="outline" className={statusStyles[review.status]}>
                  {t(`account.status.${review.status}`)}
                </Badge>
              )}
            </div>
            {review.title && <p className="font-medium">{review.title}</p>}
            <p className="text-sm text-gray-700 whitespace-pre-line">{review.text}</p>
            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}

// ---------- Profile ----------

function Profile() {
  const { t, i18n } = useTranslation();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", username: "", email: "", bio: "", password: "", language: "de" });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiFetch<{ user: UserType }>(`/api/users/${auth.userId}`, { token: auth.token })
      .then(({ user }) =>
        setForm({
          fullName: user.profile.fullName,
          username: user.username,
          email: user.email,
          bio: user.profile.bio ?? "",
          password: "",
          language: user.settings?.language ?? "de",
        })
      )
      .catch((err) => setError(err.message));
  }, [auth.userId, auth.token]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/users/${auth.userId}`, { method: "PATCH", token: auth.token, body: form });
      setForm((prev) => ({ ...prev, password: "" }));
      i18n.changeLanguage(form.language);
      toast.success(t("account.saved"));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
    setIsSaving(false);
  }

  async function deleteAccount() {
    if (!window.confirm(t("account.deleteConfirm"))) return;
    try {
      await apiFetch(`/api/users/${auth.userId}`, { method: "DELETE", token: auth.token });
      auth.logout();
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
  }

  return (
    <Card className="p-6 max-w-xl">
      <form onSubmit={save} className="space-y-4">
        {(
          [
            ["fullName", t("auth.fullName"), "text"],
            ["username", t("auth.username"), "text"],
            ["email", t("auth.email"), "email"],
          ] as const
        ).map(([name, label, type]) => (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} value={form[name]} onChange={handleChange} required />
          </div>
        ))}
        <div className="space-y-2">
          <Label htmlFor="bio">{t("account.bio")}</Label>
          <Textarea id="bio" name="bio" maxLength={1000} value={form.bio} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">{t("common.language")}</Label>
          <select
            id="language"
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("account.newPassword")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <Button type="submit" disabled={isSaving}>
          {t("account.save")}
        </Button>
      </form>
      <div className="mt-8 pt-6 border-t">
        <Button variant="outline" className="text-red-600 border-red-200" onClick={deleteAccount}>
          {t("account.deleteAccount")}
        </Button>
      </div>
    </Card>
  );
}

// ---------- Page ----------

export default function AccountPage() {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { savedIds } = useContext(SavedOffersContext);
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab") as Tab | null;
  const tab: Tab = requested && TABS.includes(requested) ? requested : "saved";

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "saved", label: `${t("account.tabs.saved")}${savedIds.size ? ` (${savedIds.size})` : ""}`, icon: <Bookmark className="w-4 h-4" /> },
    { id: "comparisons", label: t("account.tabs.comparisons"), icon: <Columns3 className="w-4 h-4" /> },
    { id: "reviews", label: t("account.tabs.reviews"), icon: <MessageSquare className="w-4 h-4" /> },
    { id: "profile", label: t("account.tabs.profile"), icon: <UserRound className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      <Seo title={t("account.title")} />
      <div>
        <h1 className="text-2xl font-bold">{t("account.title")}</h1>
        {auth.fullName && <p className="text-gray-600">{t("account.hello", { name: auth.fullName })}</p>}
      </div>
      <div role="tablist" className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map(({ id, label, icon }) => (
          <Button
            key={id}
            role="tab"
            aria-selected={tab === id}
            size="sm"
            variant={tab === id ? "default" : "outline"}
            onClick={() => setParams(id === "saved" ? {} : { tab: id }, { replace: true })}
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === "saved" && <Watchlist />}
        {tab === "comparisons" && <Comparisons />}
        {tab === "reviews" && <MyReviews />}
        {tab === "profile" && <Profile />}
      </div>
    </div>
  );
}
