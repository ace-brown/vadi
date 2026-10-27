import LegalPage from "./LegalPage";

// Ranking transparency (UWG / EU Omnibus directive) and commission disclosure
export default function HowWeComparePage() {
  return (
    <LegalPage
      title={{ de: "So vergleichen wir", en: "How we compare" }}
      de={
        <>
          <h2>Sortierung nach dem Effektivpreis</h2>
          <p>
            Standardmäßig sortieren wir alle Angebote nach dem <strong>Effektivpreis</strong>: den
            durchschnittlichen Kosten pro Monat über 24 Monate. Darin stecken alle monatlichen Preise
            (auch höhere Preise nach einem Aktionszeitraum), die Anschlussgebühr, Kosten für Router oder
            Geräte und – abgezogen – Boni und Cashback:
          </p>
          <p className="font-mono text-sm bg-gray-50 p-3 rounded">
            (Monatspreise über 24 Monate + einmalige Kosten − Boni) ÷ 24
          </p>
          <p>
            So lassen sich Tarife mit Lockangeboten, hohen Anschlussgebühren oder unterschiedlichen
            Laufzeiten fair vergleichen. Du kannst die Sortierung jederzeit ändern, z. B. nach Monatspreis
            oder Geschwindigkeit. Die Hervorhebungen „Am günstigsten“, „Am schnellsten“ und „Meiste Daten“
            werden allein aus den Tarifdaten berechnet.
          </p>
          <h2>Keine gekauften Platzierungen</h2>
          <p>
            Anbieter können ihre Position in den Ergebnissen nicht kaufen. Gesponserte Platzierungen gibt
            es nicht; sollte sich das ändern, kennzeichnen wir sie deutlich als Anzeige.
          </p>
          <h2>Wie wir uns finanzieren</h2>
          <p>
            Wenn du über „Zum Angebot“ einen Vertrag abschließt, erhalten wir unter Umständen eine Provision
            vom Anbieter oder einem Partnernetzwerk. Für dich ändert das nichts am Preis, und es hat keinen
            Einfluss auf die Sortierung. Links zu Anbietern sind als Partnerlinks gekennzeichnet.
          </p>
          <h2>Welche Angebote wir zeigen</h2>
          <p>
            Wir zeigen nicht alle Tarife des Marktes, sondern die Angebote, die uns vorliegen. Wann die
            Preise zuletzt geprüft wurden, steht bei den Ergebnissen und bei jedem Angebot. Die
            Verfügbarkeit von Glasfaser und Kabel richtet sich nach der Postleitzahl; die genaue Prüfung
            für deine Adresse macht der Anbieter.
          </p>
          <h2>Bewertungen</h2>
          <p>
            Die Sterne-Bewertung eines Anbieters ist eine redaktionelle Einschätzung; die Quelle steht beim
            Anbieter. Kundenbewertungen werden vor der Veröffentlichung geprüft, aber nicht nach Inhalt
            ausgewählt: Wir veröffentlichen positive wie negative Bewertungen.
          </p>
        </>
      }
      en={
        <>
          <h2>Sorted by effective price</h2>
          <p>
            By default all offers are sorted by their <strong>effective price</strong>: the average cost
            per month over 24 months. It includes every monthly price (including higher prices after a promo
            period), the setup fee, router or device costs and, subtracted, bonuses and cashback:
          </p>
          <p className="font-mono text-sm bg-gray-50 p-3 rounded">
            (monthly prices over 24 months + one-off costs − bonuses) ÷ 24
          </p>
          <p>
            This makes plans with teaser prices, high setup fees or different contract lengths fair to
            compare. You can change the sorting at any time, e.g. to monthly price or speed. The labels
            "Cheapest", "Fastest" and "Most data" are calculated from the plan data alone.
          </p>
          <h2>No paid rankings</h2>
          <p>
            Providers cannot buy their position in the results. There are no sponsored placements; if that
            ever changes, they will be clearly marked as ads.
          </p>
          <h2>How we make money</h2>
          <p>
            If you sign up through "Go to offer", we may receive a commission from the provider or a partner
            network. This doesn't change your price and doesn't affect the ranking. Links to providers are
            marked as partner links.
          </p>
          <h2>Which offers we show</h2>
          <p>
            We don't show every plan on the market, only the offers available to us. When prices were last
            checked is shown with the results and on every offer. Fiber and cable availability is based on
            the postcode; the provider checks your exact address.
          </p>
          <h2>Ratings</h2>
          <p>
            A provider's star rating is an editorial assessment; its source is shown with the provider.
            Customer reviews are checked before publishing but not selected by opinion: we publish positive
            and negative reviews alike.
          </p>
        </>
      }
    />
  );
}
