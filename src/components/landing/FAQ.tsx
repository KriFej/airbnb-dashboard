import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "C'est quoi le LMNP ?",
    a: "Le statut LMNP (Loueur Meublé Non Professionnel) s'applique à tout propriétaire qui loue un logement meublé et dont les revenus locatifs sont inférieurs à 23 000 €/an ou à 50 % de ses revenus totaux.",
  },
  {
    q: "Quelle est la différence entre Micro-BIC et Régime Réel ?",
    a: "En Micro-BIC, vous bénéficiez d'un abattement forfaitaire de 50 % (ou 71 % pour un meublé de tourisme classé) sur vos revenus bruts. En Régime Réel, vous déduisez toutes vos charges réelles (intérêts d'emprunt, taxe foncière, assurance, amortissements...). Le Réel est souvent plus avantageux si vos charges dépassent 50 % de vos revenus.",
  },
  {
    q: "Comment sont calculés les amortissements LMNP ?",
    a: "En régime réel, vous pouvez amortir le bien immobilier (hors terrain) sur 25 à 30 ans, le mobilier sur 5 à 7 ans, et les travaux sur 10 ans. LocFiscal fait le calcul automatiquement à partir du prix d'achat.",
  },
  {
    q: "Est-ce que LocFiscal remplace un comptable ?",
    a: "LocFiscal est un outil de simulation et de suivi. Il ne remplace pas un expert-comptable pour l'adhésion à un CGA (Centre de Gestion Agréé) ou pour la vérification de votre déclaration. Mais il vous permet de comprendre votre situation et de préparer un résumé clair pour votre comptable — ou de faire vous-même si votre situation est simple.",
  },
  {
    q: "La loi Le Meur 2024 change-t-elle quelque chose ?",
    a: "Oui. La loi de finances 2024 a réduit l'abattement Micro-BIC pour les meublés de tourisme non classés de 71 % à 50 %, et supprimé l'avantage fiscal pour les classés dans certaines communes. LocFiscal intègre ces nouvelles règles.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Vos données sont stockées sur des serveurs Supabase situés en Union Européenne, chiffrées, et accessibles uniquement par vous. Vous pouvez exporter ou supprimer votre compte à tout moment.",
  },
  {
    q: "Le simulateur est-il vraiment gratuit ?",
    a: "Oui. Le simulateur Micro-BIC vs Régime Réel est 100 % gratuit, sans inscription. Le plan Pro ajoute le suivi annuel, l'export PDF et le tableau de bord multi-biens.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border/30 py-14 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-brand-500">FAQ</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            Questions fréquentes.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[15px] font-medium text-fg">{item.q}</span>
                <Plus size={18} className="shrink-0 text-muted transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
