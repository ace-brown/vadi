import { Link } from "react-router-dom";
import { SITE } from "@/config/site";
import LegalPage from "./LegalPage";

// Describes what the app actually does. Have it reviewed before launch, and
// update it whenever analytics, cookies or new processors are added.
export default function PrivacyPage() {
  const controller = `${SITE.operator.name}, ${SITE.operator.street}, ${SITE.operator.city}`;
  return (
    <LegalPage
      title={{ de: "Datenschutzerklärung", en: "Privacy policy" }}
      de={
        <>
          <h2>1. Verantwortlicher</h2>
          <p>
            {controller}. E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Weitere Angaben im{" "}
            <Link to="/impressum">Impressum</Link>.
          </p>

          <h2>2. Aufruf der Webseite (Server-Logs)</h2>
          <p>
            Beim Aufruf der Seite verarbeitet unser Hosting-Anbieter technisch notwendige Daten wie
            IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse und Browsertyp, um die Seite auszuliefern
            und vor Missbrauch zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Zum Schutz vor Missbrauch
            begrenzen wir außerdem Anmelde- und Registrierungsversuche pro IP-Adresse; diese Information
            wird nur kurzzeitig im Arbeitsspeicher gehalten.
          </p>

          <h2>3. Keine Cookies, kein Tracking</h2>
          <p>
            Wir setzen keine Cookies und verwenden keine Analyse- oder Werbedienste. Im lokalen Speicher
            deines Browsers (localStorage) speichern wir nur, was für die von dir genutzten Funktionen
            nötig ist: deine Spracheinstellung, deine Vergleichsliste und – wenn du angemeldet bist –
            deine Anmeldung (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst diese Daten jederzeit in deinem Browser
            löschen.
          </p>

          <h2>4. Klicks auf „Zum Angebot“</h2>
          <p>
            Wenn du auf „Zum Angebot“ klickst, zählen wir den Klick zusammen mit dem Angebot und dem
            Zeitpunkt – ohne IP-Adresse und ohne Bezug zu deinem Konto. Das dient der Abrechnung mit
            Partnern und der Verbesserung des Vergleichs (Art. 6 Abs. 1 lit. f DSGVO). Danach wirst du
            zum Anbieter oder zu einem Partnernetzwerk weitergeleitet; dort gilt deren
            Datenschutzerklärung, und es können Cookies gesetzt werden.
          </p>

          <h2>5. Benutzerkonto und Bewertungen</h2>
          <p>
            Für ein Konto speichern wir Benutzername, Name, E-Mail-Adresse und dein Passwort
            (verschlüsselt als Hash), um dir das Konto bereitzustellen (Art. 6 Abs. 1 lit. b DSGVO).
            Wenn du eine Bewertung schreibst, wird sie nach Prüfung mit deinem Namen veröffentlicht.
            Du kannst dein Konto jederzeit löschen lassen.
          </p>

          <h2>6. Empfänger und Hosting</h2>
          <ul>
            <li>Vercel Inc. (Hosting der Webseite und der API), USA – Übermittlung auf Grundlage des EU-US Data Privacy Framework bzw. von Standardvertragsklauseln.</li>
            <li>MongoDB Inc. (Datenbank „MongoDB Atlas“) – Auftragsverarbeitung gemäß Art. 28 DSGVO.</li>
          </ul>

          <h2>7. Speicherdauer</h2>
          <p>
            Kontodaten speichern wir, bis du dein Konto löschst. Klickzählungen enthalten keine
            personenbezogenen Daten. Server-Logs werden vom Hosting-Anbieter nach kurzer Zeit gelöscht.
          </p>

          <h2>8. Deine Rechte</h2>
          <p>
            Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
            Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie das Recht, dich bei einer
            Datenschutz-Aufsichtsbehörde zu beschweren. Schreib uns dazu an{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </>
      }
      en={
        <>
          <h2>1. Controller</h2>
          <p>
            {controller}. Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. More details in the{" "}
            <Link to="/impressum">legal notice</Link>.
          </p>

          <h2>2. Visiting the website (server logs)</h2>
          <p>
            When you open the site, our hosting provider processes technically necessary data such as your
            IP address, date and time, the address requested and your browser type, to deliver the site and
            protect it from abuse (Art. 6(1)(f) GDPR). To prevent abuse we also limit login and sign-up
            attempts per IP address; this is only kept briefly in memory.
          </p>

          <h2>3. No cookies, no tracking</h2>
          <p>
            We don't set cookies and don't use analytics or advertising services. In your browser's local
            storage we only keep what the features you use need: your language, your comparison list and,
            if you are logged in, your login (§ 25(2) no. 2 TDDDG). You can delete this at any time in your
            browser.
          </p>

          <h2>4. "Go to offer" clicks</h2>
          <p>
            When you click "Go to offer", we count the click together with the offer and the time, without
            your IP address and without linking it to your account. We use this to settle with partners and
            improve the comparison (Art. 6(1)(f) GDPR). You are then sent to the provider or a partner
            network, whose privacy policy applies and who may set cookies.
          </p>

          <h2>5. Accounts and reviews</h2>
          <p>
            For an account we store your username, name, email address and password (as a hash) to provide
            the account (Art. 6(1)(b) GDPR). If you write a review, it is published with your name after it
            has been checked. You can have your account deleted at any time.
          </p>

          <h2>6. Recipients and hosting</h2>
          <ul>
            <li>Vercel Inc. (hosting of the website and API), USA – transfers based on the EU-US Data Privacy Framework or standard contractual clauses.</li>
            <li>MongoDB Inc. (database "MongoDB Atlas") – data processing agreement under Art. 28 GDPR.</li>
          </ul>

          <h2>7. Retention</h2>
          <p>
            Account data is kept until you delete your account. Click counts contain no personal data.
            Server logs are deleted by the hosting provider after a short time.
          </p>

          <h2>8. Your rights</h2>
          <p>
            You have the right to access, rectification, erasure, restriction of processing, data
            portability and objection (Art. 15–21 GDPR), and the right to complain to a data protection
            authority. Write to us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </>
      }
    />
  );
}
