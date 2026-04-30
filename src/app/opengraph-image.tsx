import { ImageResponse } from "next/og";

export const alt = "Hintsight — a scoreboard for your judgment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 60%, #2a1810 100%)",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Brand mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="30" height="30" rx="9" fill="#fafafa" />
            <path
              d="M9 20.5C9 20.5 11.6 14 16 14C20.4 14 23 20.5 23 20.5"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="16" cy="14" r="2" fill="#1a1a1a" />
            <circle cx="9" cy="20.5" r="1.5" fill="#1a1a1a" opacity="0.6" />
            <circle cx="23" cy="20.5" r="1.5" fill="#ed704a" />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: -1 }}>
            Hintsight
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 80,
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 1.0,
          }}
        >
          <span>A scoreboard</span>
          <span>
            for your{" "}
            <span style={{ color: "#ed704a", fontStyle: "italic" }}>
              judgment.
            </span>
          </span>
        </div>

        {/* Subline */}
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "rgba(250,250,250,0.65)",
            maxWidth: 880,
            lineHeight: 1.35,
          }}
        >
          Predict today. Find out if you were right. Calibrate your judgment
          over time.
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            fontSize: 18,
            fontFamily: "monospace",
            color: "rgba(250,250,250,0.5)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>Free · Open source</span>
          <span>hintsight.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
