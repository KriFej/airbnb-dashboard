import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Combien coûte locpilote ?",
    a: "Trois offres : Starter à 9,90 €/mois (jusqu'à 3 biens), Pro à 19,90 €/mois (jusqu'à 10 biens) et Unlimited sur devis à partir de 11 biens. Résiliable à tout moment.",
  },
  {
    q: "C'est quoi un iCal ?",
    a: "Un iCal (.ics) est un lien que génèrent Airbnb et Booking.com pour exporter votre calendrier. En le collant dans locpilote, vos réservations s'importent automatiquement — sans saisie manuelle.",
  },
  {
    q: "Comment trouver mon URL iCal sur Airbnb ?",
    a: "Dans l'app Airbnb : Calendrier → votre logement → Disponibilité → Exporter le calendrier. Copiez l'URL .ics et collez-la dans locpilote.",
  },
  {
    q: "Est-ce que ça marche avec Booking.com ?",
    a: "Oui — toute source iCal (.ics) est compatible : Airbnb, Booking.com, Vrbo, Hostaway, Smoobu, Google Calendar, etc.",
  },
  {
    q: "Où sont stockées mes données ?",
    a: "Sur des serveurs Supabase en Union européenne, chiffrées et accessibles uniquement par vous. Export ou suppression à tout moment.",
  },
  {
    q: "Puis-je suivre plusieurs biens ?",
    a: "Oui. Starter couvre 1 à 3 biens, Pro jusqu'à 10, Unlimited est conçu pour les portefeuilles de 11 biens et plus.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-16 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">FAQ</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-fg md:text-5xl">
            Questions fréquentes
          </h2>
          <p className="mt-3 text-muted">Tout ce que vous devez savoir avant de commencer.</p>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-border bg-white shadow-card">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5">
                <span className="text-[15px] font-semibold text-fg">{item.q}</span>
                <Plus
                  size={18}
                  className="shrink-0 text-brand-500 transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
