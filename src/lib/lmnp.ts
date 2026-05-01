// Calculs fiscaux LMNP (Loueur Meublé Non Professionnel)
// Réglementation française 2024

export type RegimeFiscal = "micro-bic" | "reel";

export type TranscheIR =
  | "0%"
  | "11%"
  | "30%"
  | "41%"
  | "45%";

export interface ChargesReelles {
  interetsEmprunt: number;      // €/an
  chargesCopropriete: number;   // €/an
  taxeFonciere: number;         // €/an
  assurance: number;            // €/an
  fraisPlatformes: number;      // €/an (commissions Airbnb/Booking)
  travauxEntretien: number;     // €/an
  autresCharges: number;        // €/an
}

export interface AmortissementsAnnuels {
  bien: number;        // valeur bien (hors terrain) / 25 ans typiquement
  mobilier: number;   // valeur mobilier / 7 ans typiquement
  travaux: number;    // gros travaux / 10 ans
}

export interface LMNPInputs {
  revenusAirbnb: number;       // revenus bruts Airbnb annuels
  revenusBooking: number;      // revenus bruts Booking annuels
  fraisAirbnbPct: number;      // % commission Airbnb (ex: 14)
  fraisBookingPct: number;     // % commission Booking (ex: 15)
  charges: ChargesReelles;
  amortissements: AmortissementsAnnuels;
  trancheMarginaleIR: number;  // TMI en % (0, 11, 30, 41, 45)
  meubleTourismeClasse: boolean; // abattement 71% si classé
  prixAcquisition: number;     // pour calculer rentabilité
}

export interface ResultatRegime {
  regime: RegimeFiscal;
  revenusImposables: number;
  baseImposable: number;
  impotRevenu: number;
  prelevementsSociaux: number;  // 17.2%
  totalImposition: number;
  chargesDeduites: number;
  label: string;
}

export interface ComparaisonLMNP {
  revenusBruts: number;
  revenusNetsPlateformes: number;  // après commissions
  micro: ResultatRegime;
  reel: ResultatRegime;
  economieFiscale: number;           // économie si on choisit le bon régime
  meilleurRegime: RegimeFiscal;
  rentabiliteBrute: number | null;   // % annuel
  rentabiliteNette: number | null;   // après impôts
  totalChargesReelles: number;
  totalAmortissements: number;
}

const TAUX_PRELEVEMENTS_SOCIAUX = 0.172;

// Calcul IR selon les tranches 2024
function calculIR(baseImposable: number, tmi: number): number {
  if (baseImposable <= 0) return 0;
  // Simplification : on applique le TMI à la base imposable entière
  // (l'utilisateur a déjà son TMI — on ne recompute pas l'IR total du foyer)
  return Math.max(0, baseImposable * (tmi / 100));
}

export function totalCharges(c: ChargesReelles): number {
  return (
    c.interetsEmprunt +
    c.chargesCopropriete +
    c.taxeFonciere +
    c.assurance +
    c.fraisPlatformes +
    c.travauxEntretien +
    c.autresCharges
  );
}

export function totalAmortissements(a: AmortissementsAnnuels): number {
  return a.bien + a.mobilier + a.travaux;
}

export function computeLMNP(inputs: LMNPInputs): ComparaisonLMNP {
  const revenusBruts = inputs.revenusAirbnb + inputs.revenusBooking;

  const fraisAirbnb = (inputs.revenusAirbnb * inputs.fraisAirbnbPct) / 100;
  const fraisBooking = (inputs.revenusBooking * inputs.fraisBookingPct) / 100;
  const fraisPlatformes = fraisAirbnb + fraisBooking;

  // Les revenus imposables = revenus bruts AVANT déduction des commissions
  // (les commissions sont déduites dans le régime réel comme charges)
  const revenusImposables = revenusBruts;

  // --- MICRO-BIC ---
  const abattementPct = inputs.meubleTourismeClasse ? 0.71 : 0.50;
  const baseMicro = Math.max(0, revenusImposables * (1 - abattementPct));
  const irMicro = calculIR(baseMicro, inputs.trancheMarginaleIR);
  const psMicro = baseMicro * TAUX_PRELEVEMENTS_SOCIAUX;

  const micro: ResultatRegime = {
    regime: "micro-bic",
    revenusImposables,
    baseImposable: baseMicro,
    impotRevenu: irMicro,
    prelevementsSociaux: psMicro,
    totalImposition: irMicro + psMicro,
    chargesDeduites: revenusImposables * abattementPct,
    label: inputs.meubleTourismeClasse ? "Micro-BIC (71%)" : "Micro-BIC (50%)",
  };

  // --- RÉGIME RÉEL ---
  const chargesTotal = totalCharges({
    ...inputs.charges,
    fraisPlatformes: fraisPlatformes, // on remplace par le calcul auto
  });
  const amortissementsTotal = totalAmortissements(inputs.amortissements);
  const chargesEtAmortissements = chargesTotal + amortissementsTotal;
  const baseReelle = Math.max(0, revenusImposables - chargesEtAmortissements);
  const irReel = calculIR(baseReelle, inputs.trancheMarginaleIR);
  const psReel = baseReelle * TAUX_PRELEVEMENTS_SOCIAUX;

  const reel: ResultatRegime = {
    regime: "reel",
    revenusImposables,
    baseImposable: baseReelle,
    impotRevenu: irReel,
    prelevementsSociaux: psReel,
    totalImposition: irReel + psReel,
    chargesDeduites: chargesEtAmortissements,
    label: "Régime Réel",
  };

  const meilleurRegime: RegimeFiscal =
    micro.totalImposition <= reel.totalImposition ? "micro-bic" : "reel";
  const economieFiscale = Math.abs(
    micro.totalImposition - reel.totalImposition,
  );

  const revenusNetsPlateformes = revenusBruts - fraisPlatformes;
  const rentabiliteBrute =
    inputs.prixAcquisition > 0
      ? (revenusBruts / inputs.prixAcquisition) * 100
      : null;
  const meilleurImposable =
    meilleurRegime === "micro-bic" ? micro.totalImposition : reel.totalImposition;
  const beneficeNet = revenusNetsPlateformes - chargesTotal - meilleurImposable;
  const rentabiliteNette =
    inputs.prixAcquisition > 0
      ? (beneficeNet / inputs.prixAcquisition) * 100
      : null;

  return {
    revenusBruts,
    revenusNetsPlateformes,
    micro,
    reel,
    economieFiscale,
    meilleurRegime,
    rentabiliteBrute,
    rentabiliteNette,
    totalChargesReelles: chargesTotal,
    totalAmortissements: amortissementsTotal,
  };
}

export const DEFAULT_LMNP_INPUTS: LMNPInputs = {
  revenusAirbnb: 12000,
  revenusBooking: 4000,
  fraisAirbnbPct: 14,
  fraisBookingPct: 15,
  charges: {
    interetsEmprunt: 3600,
    chargesCopropriete: 1200,
    taxeFonciere: 800,
    assurance: 400,
    fraisPlatformes: 0, // calculé automatiquement
    travauxEntretien: 500,
    autresCharges: 300,
  },
  amortissements: {
    bien: 4000,   // ex: 100k€ / 25 ans
    mobilier: 857, // ex: 6k€ / 7 ans
    travaux: 0,
  },
  trancheMarginaleIR: 30,
  meubleTourismeClasse: false,
  prixAcquisition: 200000,
};

export const TRANCHES_IR = [0, 11, 30, 41, 45];

export function labelTMI(tmi: number): string {
  return `${tmi}%`;
}

// Formatters
export function formatEuro(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals).replace(".", ",")} %`;
}
