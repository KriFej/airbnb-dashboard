export type Inputs = {
  airbnb: number;
  booking: number;
  future: number;
  credit: number;
  elec: number;
  eau: number;
  internet: number;
  menage: number;
  airbnbFeePct: number;
  bookingFeePct: number;
};

export const DEFAULT_INPUTS: Inputs = {
  airbnb: 0,
  booking: 0,
  future: 0,
  credit: 0,
  elec: 0,
  eau: 0,
  internet: 0,
  menage: 0,
  airbnbFeePct: 14,
  bookingFeePct: 15,
};

export type Booking = {
  uid: string;
  summary: string;
  start: string; // ISO date (yyyy-MM-dd)
  end: string; // ISO date (yyyy-MM-dd, exclusive end per iCal spec)
  source?: "airbnb" | "booking" | "other";
};

export type KpiData = {
  grossRevenue: number;
  platformFees: number;
  totalExpenses: number;
  netProfit: number;
  feesLostPct: number;
  forecast: number;
};
