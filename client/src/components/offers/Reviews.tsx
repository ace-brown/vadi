import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/context/auth-context";
import { apiFetch, ApiError, useApi } from "@/lib/api";
import { ReviewType } from "@/types";
import { formatDate } from "@/utils/helpers";

type ReviewsResponse = { reviews: ReviewType[]; count: number; average: number | null };

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-4 h-4 ${n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
      ))}
    </span>
  );
}

function ReviewForm({ providerId }: { providerId: string }) {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) return <p className="text-sm text-emerald-700">{t("reviews.thanks")}</p>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsSending(true);
    try {
      await apiFetch("/api/reviews", {
        method: "POST",
        token: auth.token,
        body: { provider: providerId, rating, title: title || undefined, text },
      });
      setSent(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : String(err));
    }
    setIsSending(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3 border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold">{t("reviews.write")}</h3>
      <fieldset>
        <legend className="text-sm font-medium mb-1">{t("reviews.rating")}</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={t("reviews.stars", { count: n })}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
            >
              <Star className={`w-6 h-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-medium">
        {t("reviews.titleLabel")}
        <Input className="mt-1 bg-white" maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="block text-sm font-medium">
        {t("reviews.text")}
        <Textarea
          className="mt-1 bg-white"
          required
          minLength={10}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <Button type="submit" disabled={isSending}>
        {t("reviews.submit")}
      </Button>
    </form>
  );
}

export default function Reviews({ providerId }: { providerId: string }) {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { data } = useApi<ReviewsResponse>(`/api/reviews?provider=${providerId}`);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{t("reviews.title")}</h2>
        {data && data.count > 0 && data.average !== null && (
          <p className="text-sm text-gray-600">
            {t("reviews.summary", { count: data.count, average: data.average })}
          </p>
        )}
      </div>

      {data && data.reviews.length === 0 && <p className="text-sm text-gray-500">{t("reviews.none")}</p>}
      <ul className="space-y-3">
        {data?.reviews.map((review) => (
          <li key={review._id} className="border rounded-lg p-4 bg-white">
            <div className="flex flex-wrap items-center gap-2">
              <Stars value={review.rating} />
              {review.title && <span className="font-semibold">{review.title}</span>}
            </div>
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{review.text}</p>
            <p className="mt-2 text-xs text-gray-500">
              {review.authorName} · {formatDate(review.createdAt)}
            </p>
          </li>
        ))}
      </ul>

      {auth.isLoggedIn ? (
        <ReviewForm providerId={providerId} />
      ) : (
        <Link to="/login" className="text-sm text-blue-700 hover:underline">
          {t("reviews.loginToReview")}
        </Link>
      )}
    </section>
  );
}
