import { SITE } from "@/config/site";
import LegalPage from "./LegalPage";

function Address() {
  const { operator, email, phone, vatId } = SITE;
  return (
    <>
      <p>
        {operator.name}
        <br />
        {operator.street}
        <br />
        {operator.city}
        <br />
        {operator.country}
      </p>
      <p>
        E-Mail: <a href={`mailto:${email}`}>{email}</a>
        {phone && (
          <>
            <br />
            Telefon: {phone}
          </>
        )}
      </p>
      {vatId && <p>USt-IdNr.: {vatId}</p>}
    </>
  );
}

export default function ImpressumPage() {
  return (
    <LegalPage
      title={{ de: "Impressum", en: "Legal notice (Impressum)" }}
      de={
        <>
          <h2>Angaben gemäß § 5 DDG</h2>
          <Address />
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            {SITE.operator.name}, Anschrift wie oben
          </p>
          <h2>Hinweis zu den Tarifdaten</h2>
          <p>
            Alle Angaben zu Tarifen und Preisen werden sorgfältig gepflegt, können sich beim Anbieter
            aber jederzeit ändern. Maßgeblich sind die Bedingungen des jeweiligen Anbieters zum Zeitpunkt
            des Vertragsabschlusses.
          </p>
          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </>
      }
      en={
        <>
          <h2>Information according to § 5 DDG</h2>
          <Address />
          <h2>Responsible for the content under § 18 (2) MStV</h2>
          <p>{SITE.operator.name}, address as above</p>
          <h2>About the plan data</h2>
          <p>
            All plan and price details are maintained carefully but can change at the provider at any time.
            The provider's terms at the time you sign up apply.
          </p>
          <h2>Consumer dispute resolution</h2>
          <p>
            We are neither willing nor obliged to take part in dispute resolution proceedings before a
            consumer arbitration board.
          </p>
        </>
      }
    />
  );
}
