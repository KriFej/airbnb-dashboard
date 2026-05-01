import Link from "next/link";

export const metadata = { title: "Conditions générales d'utilisation — locpilote" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-sm text-muted">
      <Link href="/" className="text-brand-400 hover:text-brand-300 text-xs">← Retour</Link>
      <h1 className="mt-6 text-3xl font-medium text-fg">Conditions générales d&apos;utilisation</h1>
      <p className="mt-2 text-xs text-dim">Dernière mise à jour : avril 2026</p>

      <Section title="1. Objet">
        <p>Les présentes CGU régissent l&apos;utilisation du service locpilote, tableau de bord de rentabilité pour hôtes Airbnb et Booking.</p>
      </Section>

      <Section title="2. Accès au service">
        <p>L&apos;accès nécessite la création d&apos;un compte avec une adresse email valide. Vous êtes responsable de la confidentialité de vos identifiants.</p>
      </Section>

      <Section title="3. Abonnements et paiements">
        <ul className="list-disc pl-5 space-y-1">
          <li>Les abonnements sont mensuels et renouvelés automatiquement.</li>
          <li>Annulation possible à tout moment depuis votre compte.</li>
          <li>Aucun remboursement pour la période en cours.</li>
          <li>Les paiements sont traités par Stripe.</li>
        </ul>
      </Section>

      <Section title="4. Utilisation du service">
        <p>Vous vous engagez à :</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Ne pas utiliser le service à des fins illégales.</li>
          <li>Ne pas tenter de contourner les limitations de votre plan.</li>
          <li>Ne pas partager votre compte avec des tiers.</li>
        </ul>
      </Section>

      <Section title="5. Données et confidentialité">
        <p>Vos données sont traitées conformément à notre <Link href="/legal/privacy" className="text-brand-400">Politique de confidentialité</Link>. Vous restez propriétaire de vos données.</p>
      </Section>

      <Section title="6. Disponibilité">
        <p>locpilote s&apos;efforce d&apos;assurer une disponibilité maximale du service mais ne garantit pas une disponibilité de 100 %. Des interruptions de maintenance peuvent survenir.</p>
      </Section>

      <Section title="7. Limitation de responsabilité">
        <p>locpilote est un outil d&apos;aide à la décision. Les calculs sont basés sur les données que vous saisissez. locpilote ne peut être tenu responsable de décisions financières prises sur la base des données affichées.</p>
      </Section>

      <Section title="8. Résiliation">
        <p>Vous pouvez supprimer votre compte à tout moment depuis les paramètres. locpilote se réserve le droit de suspendre un compte en cas de violation des présentes CGU.</p>
      </Section>

      <Section title="9. Contact">
        <p><a href="mailto:hello@locpilote.com" className="text-brand-400">hello@locpilote.com</a></p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-base font-medium text-fg">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
