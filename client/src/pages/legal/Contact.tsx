import { Mail } from "lucide-react";
import { SITE } from "@/config/site";
import LegalPage from "./LegalPage";

function Email() {
  return (
    <p className="flex items-center gap-2">
      <Mail className="text-[#023e8a]" />
      <a href={`mailto:${SITE.email}`} className="break-all">
        {SITE.email}
      </a>
    </p>
  );
}

export default function ContactPage() {
  return (
    <LegalPage
      title={{ de: "Kontakt", en: "Contact" }}
      de={
        <>
          <p>Fragen, Hinweise auf falsche Preise oder Anbieter, die gelistet werden möchten: schreib uns.</p>
          <Email />
        </>
      }
      en={
        <>
          <p>Questions, wrong prices, or a provider that wants to be listed: write to us.</p>
          <Email />
        </>
      }
    />
  );
}
