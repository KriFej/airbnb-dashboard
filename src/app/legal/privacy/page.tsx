import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — locpilote" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-sm text-muted">
      <Link href="/" className="text-brand-400 hover:text-brand-300 text-xs">← Retour</Link>
      <h1 className="mt-6 text-3xl font-medium text-white">Politique de confidentialité</h1>
      <p className="mt-2 text-xs text-dim">Dernière mise à jour : avril 2026</p>

      <Section title="1. Responsable du traitement">
        <p>locpilote, exploité par un entrepreneur individuel. Contact : <a href="mailto:hello@locpilote.com" className="text-brand-400">hello@locpilote.com</a></p>
      </Section>

      <Section title="2. Données collectées">
        <ul className="list-disc pl-5 space-y-1">
          <li>Adresse email (création de compte)</li>
          <li>Données de revenus et dépenses saisies manuellement</li>
          <li>URLs de calendriers iCal</li>
          <li>Données d&apos;utilisation anonymisées (logs techniques)</li>
        </ul>
      </Section>

      <Section title="3. Finalités du traitement">
        <ul className="list-disc pl-5 space-y-1">
          <li>Fourniture du service (tableau de bord, calculs)</li>
          <li>Gestion des abonnements et paiements</li>
          <li>Support client</li>
          <li>Amélioration du produit</li>
        </ul>
      </Section>

      <Section title="4. Base légale">
        <p>Exécution du contrat (CGU) et intérêt légitime pour l&apos;amélioration du service.</p>
      </Section>

      <Section title="5. Conservation des données">
        <p>Les données sont conservées pendant la durée de vie du compte, puis supprimées dans les 30 jours suivant la résiliation.</p>
      </Section>

      <Section title="6. Sous-traitants">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-white">Supabase</strong> — hébergement base de données (UE)</li>
          <li><strong className="text-white">Vercel</strong> — hébergement application (UE)</li>
          <li><strong className="text-white">Stripe</strong> — paiements</li>
          <li><strong className="text-white">Resend</strong> — envoi d&apos;emails transactionnels</li>
        </ul>
      </Section>

      <Section title="7. Vos droits (RGPD)">
        <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité et d&apos;opposition. Pour exercer ces droits : <a href="mailto:hello@locpilote.com" className="text-brand-400">hello@locpilote.com</a></p>
      </Section>

      <Section title="8. Cookies">
        <p>locpilote utilise uniquement des cookies techniques nécessaires au fonctionnement de l&apos;authentification. Aucun cookie publicitaire.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-base font-medium text-white">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
