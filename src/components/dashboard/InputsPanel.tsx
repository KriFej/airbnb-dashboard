"use client";

import {
  Banknote,
  Droplets,
  Home as HomeIcon,
  Percent,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";
import { Inputs } from "@/lib/types";
import { NumberInput } from "../ui/Input";

type Props = {
  inputs: Inputs;
  onChange: (patch: Partial<Inputs>) => void;
};

export function InputsPanel({ inputs, onChange }: Props) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {/* Revenus */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-white">Revenues</h3>
        <p className="text-xs text-muted">Gross amounts per channel.</p>
        <div className="mt-5 space-y-4">
          <NumberInput
            label="Airbnb revenue"
            value={inputs.airbnb}
            onChange={(v) => onChange({ airbnb: v })}
          />
          <NumberInput
            label="Booking.com revenue"
            value={inputs.booking}
            onChange={(v) => onChange({ booking: v })}
          />
          <NumberInput
            label="Future / confirmed"
            value={inputs.future}
            onChange={(v) => onChange({ future: v })}
            icon={<Sparkles size={12} className="text-brand-500" />}
          />
        </div>
      </div>

      {/* Charges */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-white">Expenses</h3>
        <p className="text-xs text-muted">Recurring monthly charges.</p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <NumberInput
            label="Mortgage / rent"
            value={inputs.credit}
            onChange={(v) => onChange({ credit: v })}
            icon={<Banknote size={12} />}
          />
          <NumberInput
            label="Electricity"
            value={inputs.elec}
            onChange={(v) => onChange({ elec: v })}
            icon={<Zap size={12} />}
          />
          <NumberInput
            label="Water"
            value={inputs.eau}
            onChange={(v) => onChange({ eau: v })}
            icon={<Droplets size={12} />}
          />
          <NumberInput
            label="Internet"
            value={inputs.internet}
            onChange={(v) => onChange({ internet: v })}
            icon={<Wifi size={12} />}
          />
          <NumberInput
            label="Cleaning"
            value={inputs.menage}
            onChange={(v) => onChange({ menage: v })}
            icon={<HomeIcon size={12} />}
          />
        </div>
      </div>

      {/* Frais plateformes */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-white">Platform fees</h3>
        <p className="text-xs text-muted">Percentage taken by each channel.</p>
        <div className="mt-5 space-y-4">
          <NumberInput
            label="Airbnb fee"
            value={inputs.airbnbFeePct}
            onChange={(v) => onChange({ airbnbFeePct: v })}
            suffix="%"
            icon={<Percent size={12} />}
          />
          <NumberInput
            label="Booking.com fee"
            value={inputs.bookingFeePct}
            onChange={(v) => onChange({ bookingFeePct: v })}
            suffix="%"
            icon={<Percent size={12} />}
          />
        </div>
        <div className="mt-6 rounded-xl border border-border bg-[#0E0E0E] p-4">
          <div className="text-[11px] uppercase tracking-widest text-dim">
            Tip
          </div>
          <p className="mt-1 text-xs text-muted">
            Airbnb hosts usually pay 3% (split-fee) or up to 15% (host-only
            model). Check your account to be accurate.
          </p>
        </div>
      </div>
    </section>
  );
}
