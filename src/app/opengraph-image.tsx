import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "locpilote — tableau de bord de rentabilité Airbnb & Booking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#EEF2FF",
          padding: "80px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Indigo accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #4F46E5, #6366F1, #818CF8)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", marginBottom: "48px" }}>
          <span style={{ fontSize: "28px", fontWeight: "700", color: "#0F172A" }}>
            loc
          </span>
          <span style={{ fontSize: "28px", fontWeight: "700", color: "#6366F1" }}>
            pilote
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "#0F172A",
            lineHeight: 1.05,
            margin: "0 0 24px",
            maxWidth: "900px",
            letterSpacing: "-0.03em",
          }}
        >
          Vos biens, vos vrais chiffres,{" "}
          <span style={{ color: "#6366F1" }}>automatiquement.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "22px",
            color: "#64748B",
            margin: 0,
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Le tableau de bord de rentabilité pour les hôtes Airbnb & Booking.com.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "20px", marginTop: "52px" }}>
          {[
            { label: "Revenus bruts", value: "4 500 €", accent: false },
            { label: "Dépenses", value: "−620 €", accent: false },
            { label: "Bénéfice net", value: "3 195 €", accent: true },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                background: s.accent ? "#6366F1" : "#FFFFFF",
                border: "1px solid " + (s.accent ? "#6366F1" : "#E2E8F0"),
                borderRadius: "14px",
                padding: "18px 26px",
                boxShadow: s.accent
                  ? "0 8px 24px rgba(99,102,241,0.3)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: s.accent ? "rgba(255,255,255,0.7)" : "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "700",
                  color: s.accent ? "#FFFFFF" : "#0F172A",
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
