import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Combien coûte locpilote ?",
    a: "Trois offres : Starter à 9,90 €/mois (1 à 2 biens), Pro à 19,90 €/mois (3 à 10 biens) et Unlimited sur devis à partir de 11 biens. Toutes les offres sont mensuelles, résiliables à tout moment.",
  },
  {
    q: "C'est quoi un iCal ?",
    a: "Un iCal (ou .ics) est un lien que génèrent Airbnb et Booking.com pour exporter votre calendrier de réservations. En le collant dans locpilote, vos réservations s'importent automatiquement — sans saisie manuelle.",
  },
  {
    q: "Comment fonctionne l'intégration iCal ?",
    a: "Ouvrez votre calendrier Airbnb ou Booking, copiez l'URL d'export iCal, collez-la dans le tableau de bord. locpilote récupère vos réservations et les affiche instantanément.",
  },
  {
    q: "Comment trouver mon URL iCal sur Airbnb ?",
    a: "Dans l'app ou le site Airbnb : Calendrier → sélectionnez votre logement → Disponibilité → Exporter le calendrier. Copiez l'URL .ics qui s'affiche et collez-la dans locpilote.",
  },
  {
    q: "Comment trouver mon URL iCal sur Booking.com ?",
    a: "Dans l'Extranet Booking.com : Tarifs et disponibilités → Calendrier → onglet Synchroniser les calendriers → copiez l'URL iCal de sortie et collez-la dans locpilote.",
  },
  {
    q: "Où sont stockées mes données ?",
    a: "Sur des serveurs Supabase situés en Union européenne, chiffrées et accessibles uniquement par vous. Vous pouvez exporter ou supprimer votre compte à tout moment.",
  },
  {
    q: "Est-ce que ça marche avec Booking.com ?",
    a: "Oui — toute source de calendrier qui exporte une URL iCal (.ics) est compatible : Airbnb, Booking.com, Vrbo, Hostaway, Smoobu, Google Calendar, etc.",
  },
  {
    q: "Puis-je suivre plusieurs biens ?",
    a: "Starter couvre 1 à 2 biens, Pro couvre 3 à 10 avec l'agenda des réservations synchro iCal en direct, Unlimited est conçu pour les portefeuilles de 11 biens et plus (devis personnalisé).",
  },
  {
    q: "Le bénéfice net est-il précis ?",
    a: "Aussi précis que les données que vous saisissez. locpilote déduit les frais de plateforme (en % par canal) et les dépenses mensuelles fixes. À remplir sérieusement pour un résultat fiable.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">
            FAQ
          </span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Questions, réponses.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[15px] font-medium text-white">
                  {item.q}
                </span>
                <Plus
                  size={18}
                  className="shrink-0 text-muted transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="mt-3 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
