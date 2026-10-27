import { Link } from "react-router-dom";
import LegalPage from "./LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title={{ de: "Nutzungsbedingungen", en: "Terms of use" }}
      de={
        <>
          <h2>1. Was Vadi ist</h2>
          <p>
            Vadi ist ein kostenloser Vergleich von Internet- und Handytarifen. Wir verkaufen selbst keine
            Tarife. Verträge schließt du direkt mit dem jeweiligen Anbieter; dafür gelten ausschließlich
            dessen Bedingungen.
          </p>
          <h2>2. Angaben ohne Gewähr</h2>
          <p>
            Wir pflegen die Tarifdaten sorgfältig und zeigen an, wann sie zuletzt geprüft wurden. Preise
            und Verfügbarkeit können sich beim Anbieter jedoch jederzeit ändern. Wie wir sortieren,
            erklären wir unter <Link to="/how-we-compare">So vergleichen wir</Link>.
          </p>
          <h2>3. Benutzerkonto</h2>
          <ul>
            <li>Für Bewertungen brauchst du ein Konto. Gib dabei wahre Angaben an und halte dein Passwort geheim.</li>
            <li>Du kannst dein Konto jederzeit löschen lassen.</li>
          </ul>
          <h2>4. Bewertungen</h2>
          <ul>
            <li>Bewertungen müssen auf eigenen Erfahrungen beruhen und dürfen keine Beleidigungen, Werbung oder rechtswidrigen Inhalte enthalten.</li>
            <li>Wir prüfen Bewertungen vor der Veröffentlichung und können sie ablehnen oder entfernen.</li>
            <li>Mit dem Absenden erlaubst du uns, die Bewertung mit deinem Namen auf Vadi zu veröffentlichen.</li>
          </ul>
          <h2>5. Haftung</h2>
          <p>
            Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung von Leben,
            Körper oder Gesundheit. Im Übrigen haften wir nur bei Verletzung wesentlicher Pflichten und
            begrenzt auf den vorhersehbaren Schaden.
          </p>
          <h2>6. Änderungen und anwendbares Recht</h2>
          <p>
            Wir können diese Bedingungen mit Wirkung für die Zukunft ändern. Es gilt deutsches Recht.
          </p>
        </>
      }
      en={
        <>
          <h2>1. What Vadi is</h2>
          <p>
            Vadi is a free comparison of internet and mobile plans. We don't sell plans ourselves. You sign
            contracts directly with the provider, and only the provider's terms apply to them.
          </p>
          <h2>2. No guarantee</h2>
          <p>
            We maintain the plan data carefully and show when it was last checked. Prices and availability
            can still change at the provider at any time. How we sort results is explained in{" "}
            <Link to="/how-we-compare">How we compare</Link>.
          </p>
          <h2>3. Accounts</h2>
          <ul>
            <li>You need an account to write reviews. Give true details and keep your password secret.</li>
            <li>You can have your account deleted at any time.</li>
          </ul>
          <h2>4. Reviews</h2>
          <ul>
            <li>Reviews must be based on your own experience and must not contain insults, advertising or unlawful content.</li>
            <li>We check reviews before publishing them and may reject or remove them.</li>
            <li>By sending a review you allow us to publish it on Vadi with your name.</li>
          </ul>
          <h2>5. Liability</h2>
          <p>
            We are fully liable for intent and gross negligence and for injury to life, body or health.
            Otherwise we are only liable for breaches of essential obligations, limited to foreseeable damage.
          </p>
          <h2>6. Changes and applicable law</h2>
          <p>We may change these terms for the future. German law applies.</p>
        </>
      }
    />
  );
}
