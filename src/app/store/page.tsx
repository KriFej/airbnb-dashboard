"use client";

import { useState, type JSX } from "react";

// ==================== DATA ====================

const SERVER_IP = "play.vaultsmp.net";

const STATS = [
  { value: "1,247", label: "En ligne", icon: "⚡" },
  { value: "45K+", label: "Discord", icon: "💬" },
  { value: "2.1M", label: "Coffres ouverts", icon: "📦" },
  { value: "24/7", label: "Uptime", icon: "🔒" },
];

const RANKS = [
  {
    id: "vip",
    name: "VIP",
    price: "€4.99",
    period: "/mois",
    color: "#4ade80",
    glowRgb: "74,222,128",
    icon: "⭐",
    perks: ["+3 Homes", "/hide (pseudo caché)", "/fly en lobby", "Chat coloré", "Queue prioritaire"],
    featured: false,
  },
  {
    id: "mvp",
    name: "MVP",
    price: "€9.99",
    period: "/mois",
    color: "#06b6d4",
    glowRgb: "6,182,212",
    icon: "💠",
    perks: ["Tout VIP +", "+7 Homes", "/disguise", "Particules custom", "Badge exclusif", "Shards partout"],
    featured: false,
  },
  {
    id: "elite",
    name: "ELITE",
    price: "€14.99",
    period: "/mois",
    color: "#a855f7",
    glowRgb: "168,85,247",
    icon: "👑",
    perks: ["Tout MVP +", "+15 Homes", "Aura personnalisée", "Pet exclusif", "Chat global coloré", "Titre rare"],
    featured: true,
  },
  {
    id: "legend",
    name: "LEGEND",
    price: "€24.99",
    period: "/mois",
    color: "#f59e0b",
    glowRgb: "245,158,11",
    icon: "🏆",
    perks: ["Tout ELITE +", "Homes illimités", "Spawn VIP dédié", "Commandes exclusives", "Support prioritaire", "Accès bêta"],
    featured: false,
  },
];

const CRATE_KEYS = [
  {
    id: "common",
    name: "Common",
    subtitle: "L'éveil du Vault",
    price: "€1.20",
    rarity: "Commun",
    color: "#4ade80",
    glowRgb: "74,222,128",
    rewards: ["Équipement Iron", "Ressources de base", "XP ×500", "Pièces ×200"],
    badge: null as string | null,
    multipliers: [1, 5, 10, 20],
    floatDelay: "0s",
    beamDelay: "0s",
  },
  {
    id: "glow",
    name: "Glow",
    subtitle: "L'aura de la lumière",
    price: "€2.40",
    rarity: "Peu Commun",
    color: "#fbbf24",
    glowRgb: "251,191,36",
    rewards: ["Équipement Diamond", "Trésors brillants", "XP ×1500", "Effets lumineux"],
    badge: null as string | null,
    multipliers: [1, 5, 10, 20],
    floatDelay: "0.4s",
    beamDelay: "0.5s",
  },
  {
    id: "vault",
    name: "Vault",
    subtitle: "Le secret du coffre",
    price: "€3.60",
    rarity: "Rare",
    color: "#06b6d4",
    glowRgb: "6,182,212",
    rewards: ["Équipement Netherite", "Armes enchantées", "Accès Zone Vault", "XP ×3000"],
    badge: "Populaire" as string | null,
    multipliers: [1, 5, 10, 20],
    floatDelay: "0.8s",
    beamDelay: "1s",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    subtitle: "La magie cristalline",
    price: "€4.80",
    rarity: "Épique",
    color: "#a855f7",
    glowRgb: "168,85,247",
    rewards: ["Set légendaire", "Cristaux rares", "Pouvoirs mystiques", "Pet exclusif"],
    badge: "Très Rare" as string | null,
    multipliers: [1, 5, 10, 20],
    floatDelay: "1.2s",
    beamDelay: "0.3s",
  },
  {
    id: "elytra",
    name: "Elytra",
    subtitle: "La grâce des cieux",
    price: "€7.20",
    rarity: "Légendaire",
    color: "#f9a8d4",
    glowRgb: "249,168,212",
    rewards: ["Elytra divine enchantée", "Aura céleste", "Titre légendaire", "Particules divines", "Zone secrète"],
    badge: "Légendaire" as string | null,
    multipliers: [1, 5, 10, 20],
    floatDelay: "0.6s",
    beamDelay: "0.8s",
  },
];

// ==================== SVG KEY ICONS ====================

function CommonKeySVG({ color, size }: { color: string; size: number }) {
  const h = Math.round(size * 0.65);
  return (
    <svg width={size} height={h} viewBox="0 0 160 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="52" r="38" stroke={color} strokeWidth="6" opacity="0.3" />
      <circle cx="52" cy="52" r="38" stroke={color} strokeWidth="3" />
      <circle cx="52" cy="52" r="22" fill={color} opacity="0.2" />
      <circle cx="52" cy="52" r="13" fill={color} opacity="0.55" />
      <circle cx="52" cy="52" r="6" fill={color} />
      <rect x="90" y="46" width="62" height="12" rx="6" fill={color} />
      <rect x="110" y="58" width="10" height="18" rx="4" fill={color} />
      <rect x="132" y="58" width="10" height="26" rx="4" fill={color} />
    </svg>
  );
}

function GlowKeySVG({ color, size }: { color: string; size: number }) {
  const h = Math.round(size * 0.65);
  return (
    <svg width={size} height={h} viewBox="0 0 160 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="52" r="38" stroke={color} strokeWidth="3" opacity="0.4" />
      <circle cx="50" cy="52" r="28" fill={color} opacity="0.1" />
      {/* 8-pointed star */}
      <polygon
        points="50,26 55,44 72,44 59,55 64,73 50,62 36,73 41,55 28,44 45,44"
        fill={color} opacity="0.55"
      />
      <circle cx="50" cy="52" r="10" fill={color} opacity="0.8" />
      <circle cx="50" cy="52" r="5" fill={color} />
      {/* Sparkles */}
      <line x1="50" y1="10" x2="50" y2="18" stroke={color} strokeWidth="2.5" opacity="0.5" />
      <line x1="82" y1="22" x2="77" y2="27" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <line x1="18" y1="22" x2="23" y2="27" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <rect x="88" y="46" width="64" height="12" rx="6" fill={color} />
      <rect x="108" y="58" width="10" height="16" rx="4" fill={color} />
      <rect x="130" y="58" width="10" height="24" rx="4" fill={color} />
    </svg>
  );
}

function VaultKeySVG({ color, size }: { color: string; size: number }) {
  const h = Math.round(size * 0.65);
  return (
    <svg width={size} height={h} viewBox="0 0 160 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagonal vault head */}
      <polygon
        points="52,10 78,24 78,54 52,68 26,54 26,24"
        fill={color} opacity="0.12" stroke={color} strokeWidth="4" strokeLinejoin="round"
      />
      <polygon
        points="52,20 70,30 70,50 52,60 34,50 34,30"
        fill={color} opacity="0.25"
      />
      {/* Lock symbol inside */}
      <rect x="44" y="38" width="16" height="12" rx="3" fill={color} opacity="0.6" />
      <path d="M46 38 V34 A6 6 0 0 1 58 34 V38" stroke={color} strokeWidth="3" fill="none" opacity="0.8" />
      <circle cx="52" cy="44" r="2.5" fill={color} opacity="0.9" />
      {/* Circuit lines */}
      <line x1="26" y1="39" x2="14" y2="39" stroke={color} strokeWidth="2.5" opacity="0.4" strokeDasharray="3,4" />
      <line x1="14" y1="39" x2="14" y2="30" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <line x1="78" y1="35" x2="90" y2="35" stroke={color} strokeWidth="2.5" opacity="0.4" strokeDasharray="3,4" />
      <rect x="78" y="37" width="70" height="12" rx="6" fill={color} />
      <rect x="98" y="49" width="10" height="16" rx="4" fill={color} />
      <rect x="120" y="49" width="10" height="22" rx="4" fill={color} />
      <rect x="140" y="49" width="8" height="13" rx="4" fill={color} />
    </svg>
  );
}

function AmethystKeySVG({ color, size }: { color: string; size: number }) {
  const h = Math.round(size * 0.65);
  return (
    <svg width={size} height={h} viewBox="0 0 160 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main crystal */}
      <polygon
        points="52,8 74,32 68,62 36,62 30,32"
        fill={color} opacity="0.18" stroke={color} strokeWidth="3.5" strokeLinejoin="round"
      />
      <polygon
        points="52,20 66,36 62,52 42,52 38,36"
        fill={color} opacity="0.35"
      />
      {/* Crystal facets (light reflections) */}
      <line x1="52" y1="8" x2="52" y2="20" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="52" y1="20" x2="66" y2="36" stroke={color} strokeWidth="1.5" opacity="0.4" />
      {/* Small amethyst shards floating around */}
      <polygon points="18,34 24,28 28,38" fill={color} opacity="0.55" />
      <polygon points="82,16 78,8 86,12" fill={color} opacity="0.55" />
      <polygon points="16,56 22,50 24,60" fill={color} opacity="0.4" />
      <polygon points="84,56 80,48 90,52" fill={color} opacity="0.4" />
      <polygon points="10,44 16,40 14,50" fill={color} opacity="0.35" />
      {/* Center gem glow */}
      <circle cx="52" cy="36" r="8" fill={color} opacity="0.5" />
      <circle cx="52" cy="36" r="4" fill={color} opacity="0.85" />
      <rect x="68" y="30" width="80" height="12" rx="6" fill={color} />
      <rect x="90" y="42" width="10" height="16" rx="4" fill={color} />
      <rect x="114" y="42" width="10" height="24" rx="4" fill={color} />
    </svg>
  );
}

function ElytraKeySVG({ color, size }: { color: string; size: number }) {
  const h = Math.round(size * 0.72);
  return (
    <svg width={size} height={h} viewBox="0 0 160 116" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left wing */}
      <path
        d="M54 60 C40 38 14 38 10 56 C6 72 28 72 48 64 Z"
        fill={color} opacity="0.3" stroke={color} strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* Left wing inner feather */}
      <path d="M54 60 C44 48 28 46 22 56 C18 64 32 66 48 62 Z" fill={color} opacity="0.18" />
      {/* Right wing */}
      <path
        d="M54 60 C68 38 94 38 98 56 C102 72 80 72 60 64 Z"
        fill={color} opacity="0.3" stroke={color} strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* Right wing inner feather */}
      <path d="M54 60 C64 48 80 46 86 56 C90 64 76 66 60 62 Z" fill={color} opacity="0.18" />
      {/* Wing detail lines */}
      <line x1="30" y1="56" x2="18" y2="60" stroke={color} strokeWidth="1.5" opacity="0.35" />
      <line x1="78" y1="56" x2="90" y2="60" stroke={color} strokeWidth="1.5" opacity="0.35" />
      {/* Center orb */}
      <circle cx="54" cy="60" r="12" fill={color} opacity="0.2" />
      <circle cx="54" cy="60" r="8" fill={color} opacity="0.45" />
      <circle cx="54" cy="60" r="4" fill={color} />
      {/* Star sparkles */}
      <line x1="54" y1="44" x2="54" y2="50" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="42" y1="48" x2="46" y2="52" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="66" y1="48" x2="62" y2="52" stroke={color} strokeWidth="2" opacity="0.4" />
      {/* Key shaft */}
      <rect x="66" y="54" width="82" height="12" rx="6" fill={color} />
      <rect x="88" y="66" width="10" height="16" rx="4" fill={color} />
      <rect x="112" y="66" width="10" height="24" rx="4" fill={color} />
      <rect x="134" y="66" width="9" height="14" rx="4" fill={color} />
    </svg>
  );
}

function KeyIcon({ keyId, color, size = 100 }: { keyId: string; color: string; size?: number }) {
  const props = { color, size };
  const map: Record<string, JSX.Element> = {
    common:   <CommonKeySVG {...props} />,
    glow:     <GlowKeySVG {...props} />,
    vault:    <VaultKeySVG {...props} />,
    amethyst: <AmethystKeySVG {...props} />,
    elytra:   <ElytraKeySVG {...props} />,
  };
  return map[keyId] ?? <CommonKeySVG {...props} />;
}

// ==================== HERO PARTICLES ====================

const HERO_PARTICLES = [
  { x: 8,  y: 82, size: 3, delay: "0s",    dur: "3s",   c: "#06b6d4" },
  { x: 18, y: 65, size: 2, delay: "0.5s",  dur: "4s",   c: "#a855f7" },
  { x: 29, y: 88, size: 4, delay: "1s",    dur: "3.5s", c: "#06b6d4" },
  { x: 42, y: 72, size: 2, delay: "1.5s",  dur: "2.8s", c: "#a855f7" },
  { x: 50, y: 90, size: 3, delay: "0.3s",  dur: "4s",   c: "#ec4899" },
  { x: 62, y: 78, size: 2, delay: "0.8s",  dur: "3.2s", c: "#06b6d4" },
  { x: 71, y: 68, size: 4, delay: "1.2s",  dur: "3.8s", c: "#a855f7" },
  { x: 83, y: 82, size: 3, delay: "0.6s",  dur: "4.2s", c: "#06b6d4" },
  { x: 92, y: 74, size: 2, delay: "1.8s",  dur: "2.6s", c: "#ec4899" },
  { x: 14, y: 55, size: 3, delay: "2s",    dur: "3.4s", c: "#a855f7" },
  { x: 25, y: 42, size: 2, delay: "0.4s",  dur: "4.4s", c: "#06b6d4" },
  { x: 37, y: 58, size: 4, delay: "1.6s",  dur: "3s",   c: "#ec4899" },
  { x: 46, y: 48, size: 3, delay: "0.9s",  dur: "3.6s", c: "#a855f7" },
  { x: 57, y: 36, size: 2, delay: "2.2s",  dur: "4.6s", c: "#06b6d4" },
  { x: 66, y: 52, size: 3, delay: "1.4s",  dur: "3.2s", c: "#ec4899" },
  { x: 77, y: 42, size: 2, delay: "0.7s",  dur: "3.8s", c: "#a855f7" },
  { x: 88, y: 58, size: 4, delay: "1.1s",  dur: "4s",   c: "#06b6d4" },
  { x: 5,  y: 32, size: 3, delay: "2.4s",  dur: "3s",   c: "#ec4899" },
  { x: 96, y: 36, size: 2, delay: "1.7s",  dur: "4.2s", c: "#a855f7" },
  { x: 50, y: 22, size: 3, delay: "0.2s",  dur: "3.6s", c: "#06b6d4" },
  { x: 35, y: 28, size: 2, delay: "2.6s",  dur: "2.8s", c: "#ec4899" },
  { x: 72, y: 28, size: 2, delay: "0.1s",  dur: "4.8s", c: "#a855f7" },
  { x: 20, y: 18, size: 3, delay: "3s",    dur: "3.2s", c: "#06b6d4" },
  { x: 80, y: 16, size: 2, delay: "1.3s",  dur: "4s",   c: "#ec4899" },
];

function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {HERO_PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2,
            height: p.size * 2,
            background: p.c,
            boxShadow: `0 0 ${p.size * 4}px ${p.c}`,
            opacity: 0,
            animation: `vault-particle ${p.dur} ease-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ==================== CRATE CARD ====================

function CrateCard({ keyData }: { keyData: typeof CRATE_KEYS[0] }) {
  const [qtyIdx, setQtyIdx] = useState(0);
  const unitPrice = parseFloat(keyData.price.replace("€", ""));
  const totalPrice = (unitPrice * keyData.multipliers[qtyIdx]).toFixed(2);

  return (
    <div
      className="relative group flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
      style={{
        background: `linear-gradient(160deg, rgba(${keyData.glowRgb},0.07) 0%, #08080f 55%, rgba(${keyData.glowRgb},0.04) 100%)`,
        border: `1px solid rgba(${keyData.glowRgb},0.18)`,
        boxShadow: `0 0 0 1px rgba(${keyData.glowRgb},0.08), 0 4px 24px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(${keyData.glowRgb},0.14) 0%, transparent 65%)`,
        }}
      />

      {/* Light beam from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] origin-top"
        style={{
          height: "45%",
          background: `linear-gradient(to bottom, rgba(${keyData.glowRgb},0.9) 0%, rgba(${keyData.glowRgb},0.3) 50%, transparent 100%)`,
          animation: `vault-beam 2.8s ease-in-out ${keyData.beamDelay} infinite`,
        }}
      />

      {/* Shimmer streak on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-2xl"
        style={{ transition: "opacity 0.3s" }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-30%",
            width: "30%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, rgba(${keyData.glowRgb},0.08), transparent)`,
            animation: "vault-shimmer 1.8s ease-in-out infinite",
          }}
        />
      </div>

      {/* Badge */}
      {keyData.badge && (
        <div
          className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
          style={{
            background: `rgba(${keyData.glowRgb},0.18)`,
            border: `1px solid rgba(${keyData.glowRgb},0.5)`,
            color: keyData.color,
            boxShadow: `0 0 10px rgba(${keyData.glowRgb},0.25)`,
          }}
        >
          {keyData.badge}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-5 p-6">
        {/* Key icon area */}
        <div className="relative flex items-center justify-center mt-2 mb-1">
          {/* Orbit ring */}
          <div
            className="absolute rounded-full border"
            style={{
              width: 120,
              height: 120,
              borderColor: `rgba(${keyData.glowRgb},0.15)`,
              animation: `vault-glow-ring 3s ease-in-out ${keyData.floatDelay} infinite`,
            }}
          />
          {/* Outer glow halo */}
          <div
            className="absolute rounded-full"
            style={{
              width: 90,
              height: 90,
              background: `radial-gradient(circle, rgba(${keyData.glowRgb},0.15) 0%, transparent 70%)`,
            }}
          />
          {/* The key icon */}
          <div
            style={{
              filter: `drop-shadow(0 0 14px rgba(${keyData.glowRgb},0.7)) drop-shadow(0 0 30px rgba(${keyData.glowRgb},0.35))`,
              animation: `vault-float 3.8s ease-in-out ${keyData.floatDelay} infinite`,
            }}
          >
            <KeyIcon keyId={keyData.id} color={keyData.color} size={114} />
          </div>
        </div>

        {/* Rarity + name */}
        <div className="text-center">
          <div
            className="text-[10px] font-bold tracking-[0.25em] uppercase mb-1.5"
            style={{ color: `rgba(${keyData.glowRgb},0.65)` }}
          >
            {keyData.rarity}
          </div>
          <h3
            className="text-2xl font-black tracking-wide"
            style={{
              color: keyData.color,
              textShadow: `0 0 24px rgba(${keyData.glowRgb},0.55)`,
            }}
          >
            {keyData.name} Key
          </h3>
          <p className="text-[12px] text-white/35 mt-1 font-medium italic">{keyData.subtitle}</p>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${keyData.glowRgb},0.45), transparent)`,
          }}
        />

        {/* Rewards */}
        <div className="w-full space-y-2">
          {keyData.rewards.map((reward, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: keyData.color,
                  boxShadow: `0 0 6px ${keyData.color}`,
                }}
              />
              <span className="text-white/65">{reward}</span>
            </div>
          ))}
        </div>

        {/* Quantity selector */}
        <div className="grid grid-cols-4 gap-1.5 w-full">
          {keyData.multipliers.map((mult, i) => (
            <button
              key={i}
              onClick={() => setQtyIdx(i)}
              className="py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={
                qtyIdx === i
                  ? {
                      background: `rgba(${keyData.glowRgb},0.22)`,
                      border: `1px solid rgba(${keyData.glowRgb},0.65)`,
                      color: keyData.color,
                      boxShadow: `0 0 12px rgba(${keyData.glowRgb},0.28)`,
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.45)",
                    }
              }
            >
              {mult}×
            </button>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="w-full mt-auto">
          <div
            className="text-center text-2xl font-black mb-3"
            style={{
              color: keyData.color,
              textShadow: `0 0 16px rgba(${keyData.glowRgb},0.5)`,
            }}
          >
            €{totalPrice}
          </div>
          <button
            className="relative w-full py-3 rounded-xl font-bold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, rgba(${keyData.glowRgb},0.28) 0%, rgba(${keyData.glowRgb},0.12) 100%)`,
              border: `1px solid rgba(${keyData.glowRgb},0.5)`,
              color: keyData.color,
              boxShadow: `0 4px 20px rgba(${keyData.glowRgb},0.2)`,
            }}
          >
            🛒 Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== RANK CARD ====================

function RankCard({ rank }: { rank: typeof RANKS[0] }) {
  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
      style={{
        background: `linear-gradient(150deg, rgba(${rank.glowRgb},0.09) 0%, #08080f 55%)`,
        border: rank.featured
          ? `1.5px solid rgba(${rank.glowRgb},0.55)`
          : `1px solid rgba(${rank.glowRgb},0.18)`,
        boxShadow: rank.featured
          ? `0 0 40px rgba(${rank.glowRgb},0.18), 0 0 0 1px rgba(${rank.glowRgb},0.12)`
          : `0 0 0 1px rgba(${rank.glowRgb},0.06)`,
      }}
    >
      {rank.featured && (
        <div
          className="py-1.5 text-center text-[10px] font-black tracking-[0.25em] uppercase"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${rank.glowRgb},0.25), transparent)`,
            color: rank.color,
            borderBottom: `1px solid rgba(${rank.glowRgb},0.3)`,
          }}
        >
          ✦ Le Plus Populaire ✦
        </div>
      )}

      <div className={`flex flex-col flex-1 p-6 ${rank.featured ? "pt-5" : ""}`}>
        {/* Icon */}
        <div className="text-center mb-4">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-3"
            style={{
              background: `rgba(${rank.glowRgb},0.12)`,
              border: `1px solid rgba(${rank.glowRgb},0.3)`,
              boxShadow: `0 0 20px rgba(${rank.glowRgb},0.15)`,
            }}
          >
            {rank.icon}
          </div>
          <h3
            className="text-2xl font-black tracking-[0.18em]"
            style={{
              color: rank.color,
              textShadow: `0 0 20px rgba(${rank.glowRgb},0.5)`,
            }}
          >
            {rank.name}
          </h3>
          <div className="mt-1.5">
            <span className="text-3xl font-black" style={{ color: rank.color }}>
              {rank.price}
            </span>
            <span className="text-white/35 text-sm">{rank.period}</span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-4"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${rank.glowRgb},0.5), transparent)`,
          }}
        />

        {/* Perks */}
        <div className="flex-1 space-y-2.5 mb-6">
          {rank.perks.map((perk, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm">
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{
                  background: `rgba(${rank.glowRgb},0.18)`,
                  border: `1px solid rgba(${rank.glowRgb},0.35)`,
                  color: rank.color,
                }}
              >
                ✓
              </div>
              <span className="text-white/65">{perk}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: rank.featured
              ? `linear-gradient(135deg, rgba(${rank.glowRgb},0.38), rgba(${rank.glowRgb},0.2))`
              : `rgba(${rank.glowRgb},0.1)`,
            border: `1px solid rgba(${rank.glowRgb},${rank.featured ? "0.6" : "0.3"})`,
            color: rank.color,
            boxShadow: rank.featured ? `0 4px 20px rgba(${rank.glowRgb},0.28)` : undefined,
          }}
        >
          S'abonner — {rank.price}{rank.period}
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<"crates" | "ranks">("crates");
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden font-sans"
      style={{ background: "#05050a", color: "#fff" }}
    >
      {/* ===== HERO ===== */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 50%, rgba(6,182,212,0.07) 0%, transparent 65%),
              radial-gradient(ellipse 45% 45% at 20% 90%, rgba(168,85,247,0.1) 0%, transparent 60%),
              radial-gradient(ellipse 45% 45% at 80% 15%, rgba(168,85,247,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 30% 30% at 50% 100%, rgba(6,182,212,0.06) 0%, transparent 50%)
            `,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6,182,212,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6,182,212,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
          }}
        />

        {/* Floating particles */}
        <HeroParticles />

        {/* NAV */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.28), rgba(168,85,247,0.22))",
                border: "1px solid rgba(6,182,212,0.4)",
                boxShadow: "0 0 18px rgba(6,182,212,0.18)",
              }}
            >
              ⚡
            </div>
            <span
              className="font-black text-base tracking-[0.2em]"
              style={{ color: "#06b6d4", textShadow: "0 0 12px rgba(6,182,212,0.4)" }}
            >
              VAULT SMP
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-white/45 font-semibold tracking-wide">
            {[
              { id: "crates", label: "Caisses" },
              { id: "ranks",  label: "Grades"  },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as "crates" | "ranks")}
                className="transition-colors hover:text-white/80"
                style={activeTab === t.id ? { color: "#fff" } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={copyIP}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.14), rgba(168,85,247,0.1))",
              border: "1px solid rgba(6,182,212,0.28)",
              color: copied ? "#4ade80" : "#06b6d4",
            }}
          >
            <span>{copied ? "✓ Copié !" : SERVER_IP}</span>
          </button>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-8 tracking-wide"
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.28)",
              color: "#06b6d4",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#4ade80",
                boxShadow: "0 0 8px #4ade80",
                animation: "pulse 2.4s ease-in-out infinite",
              }}
            />
            1,247 joueurs en ligne maintenant
          </div>

          {/* Giant title */}
          <h1
            className="text-[72px] sm:text-[100px] md:text-[140px] font-black leading-none tracking-tighter mb-1 select-none"
            style={{
              background: "linear-gradient(135deg, #e0f7ff 0%, #06b6d4 35%, #a855f7 65%, #f9a8d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 50px rgba(6,182,212,0.25))",
            }}
          >
            VAULT
          </h1>
          <h1
            className="text-[72px] sm:text-[100px] md:text-[140px] font-black leading-none tracking-tighter mb-8 select-none"
            style={{
              background: "linear-gradient(135deg, #c084fc 0%, #a855f7 40%, #ec4899 70%, #fda4af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 50px rgba(168,85,247,0.25))",
            }}
          >
            SMP
          </h1>

          <p className="text-white/38 text-base md:text-lg mb-10 max-w-lg leading-relaxed">
            Le store officiel du serveur Minecraft le plus immersif.<br />
            Grades premium, caisses légendaires et récompenses exclusives.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setActiveTab("crates")}
              className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #0284c7)",
                boxShadow: "0 8px 32px rgba(6,182,212,0.38), 0 0 0 1px rgba(6,182,212,0.25)",
                color: "#fff",
              }}
            >
              🗝️ Ouvrir les Caisses
            </button>
            <button
              onClick={() => setActiveTab("ranks")}
              className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              👑 Voir les Grades
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20"
          style={{ animation: "vault-float-alt 2.2s ease-in-out infinite" }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div
        className="border-y py-5"
        style={{
          background: "rgba(6,182,212,0.035)",
          borderColor: "rgba(6,182,212,0.12)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div
                className="text-xl font-black"
                style={{ color: "#06b6d4", textShadow: "0 0 12px rgba(6,182,212,0.4)" }}
              >
                {s.value}
              </div>
              <div className="text-[10px] text-white/35 uppercase tracking-[0.2em] mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TAB NAV ===== */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-2 flex justify-center">
        <div
          className="flex items-center gap-1 p-1 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            { id: "crates", label: "🗝️ Caisses Mystérieuses" },
            { id: "ranks",  label: "👑 Grades Premium"      },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as "crates" | "ranks")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
              style={
                activeTab === t.id
                  ? {
                      background: "linear-gradient(135deg, rgba(6,182,212,0.18), rgba(168,85,247,0.14))",
                      border: "1px solid rgba(6,182,212,0.3)",
                      color: "#06b6d4",
                      boxShadow: "0 0 16px rgba(6,182,212,0.15)",
                    }
                  : {
                      color: "rgba(255,255,255,0.38)",
                      border: "1px solid transparent",
                    }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== CRATES SECTION ===== */}
      {activeTab === "crates" && (
        <section className="max-w-7xl mx-auto px-6 pt-10 pb-28">
          {/* Header */}
          <div className="text-center mb-14">
            <p
              className="text-[10px] font-black tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(6,182,212,0.55)" }}
            >
              Caisses Mystérieuses du Vault
            </p>
            <h2
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{
                background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.65) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Choisissez votre destin
            </h2>
            <p className="text-white/35 max-w-md mx-auto text-sm leading-relaxed">
              Cinq clés légendaires. Chacune renferme des trésors uniques.<br />
              Plus la rareté est élevée, plus les récompenses sont divines.
            </p>
          </div>

          {/* Keys grid — 1→2→3→5 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {CRATE_KEYS.map(k => (
              <CrateCard key={k.id} keyData={k} />
            ))}
          </div>

          <p className="text-center text-white/18 text-xs mt-10 leading-relaxed">
            Articles livrés en jeu après confirmation du paiement. Non remboursables sauf erreur technique.<br />
            Paiements traités par Tebex Limited.
          </p>
        </section>
      )}

      {/* ===== RANKS SECTION ===== */}
      {activeTab === "ranks" && (
        <section className="max-w-5xl mx-auto px-6 pt-10 pb-28">
          {/* Header */}
          <div className="text-center mb-14">
            <p
              className="text-[10px] font-black tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(168,85,247,0.55)" }}
            >
              Grades Premium
            </p>
            <h2
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{
                background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.65) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Élevez votre statut
            </h2>
            <p className="text-white/35 max-w-md mx-auto text-sm leading-relaxed">
              Des avantages exclusifs et un statut premium reconnu.<br />
              Résiliables à tout moment, actifs immédiatement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RANKS.map(r => <RankCard key={r.id} rank={r} />)}
          </div>

          <p className="text-center text-white/18 text-xs mt-10">
            Abonnements mensuels reconductibles. Résiliables à tout moment depuis votre espace client.
          </p>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer
        className="border-t py-12 px-6"
        style={{ borderColor: "rgba(255,255,255,0.055)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div
                className="font-black text-xl tracking-[0.22em] mb-1.5"
                style={{ color: "#06b6d4", textShadow: "0 0 12px rgba(6,182,212,0.35)" }}
              >
                VAULT SMP
              </div>
              <p className="text-white/25 text-xs leading-relaxed">
                Non affilié à Mojang AB ou Microsoft Corp.<br />
                © 2026 Vault SMP. Tous droits réservés.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-5 text-xs text-white/28 font-medium">
              {[
                "Politique de confidentialité",
                "Conditions d'utilisation",
                "Support",
                "Discord",
                "Remboursements",
              ].map(link => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-white/55 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div
            className="pt-6 text-center text-[11px] text-white/16 leading-relaxed"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            Ce site et son processus de paiement sont opérés par Tebex Limited, qui gère
            la livraison des produits, le support facturation et les remboursements.
            <br />
            Contact : support@vaultsmp.net
          </div>
        </div>
      </footer>
    </div>
  );
}
