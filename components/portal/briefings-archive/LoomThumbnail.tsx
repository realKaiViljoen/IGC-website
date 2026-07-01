"use client"

/**
 * LoomThumbnail — static 16:9 placeholder with a centered gold play triangle
 * that reveals on hover. Deliberately quiet: warm-dark fill, hairline border,
 * no image content, no YouTube-style chrome. The gold here is an exception
 * approved by the page's brief (subtle play triangle affordance), constrained
 * to hover-only so the archive reads as editorial at rest.
 */

import type { Briefing } from "@/types/client"

const GOLD = "#C78B28"

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function LoomThumbnail({ briefing }: { briefing: Briefing }) {
  const duration =
    typeof briefing.loom_duration_seconds === "number"
      ? formatDuration(briefing.loom_duration_seconds)
      : null

  return (
    <a
      href={briefing.loom_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open weekly briefing Loom video${
        duration ? ` (${duration})` : ""
      }`}
      className="group relative block overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
      style={{
        width: 160,
        height: 90,
        backgroundColor: "#101215",
        border: "1px solid #262A30",
        flexShrink: 0,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={32}
          height={32}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <circle
            cx={16}
            cy={16}
            r={15}
            fill="rgba(8, 8, 8, 0.55)"
            stroke="#262A30"
            strokeWidth={1}
            className="transition-colors duration-150 group-hover:stroke-[#C78B28]"
          />
          <path
            d="M13 10.5 L23 16 L13 21.5 Z"
            fill="#857F74"
            className="transition-colors duration-150 group-hover:fill-[#C78B28]"
            style={{ color: GOLD }}
          />
        </svg>
      </div>

      {duration && (
        <span
          className="font-mono"
          style={{
            position: "absolute",
            right: 6,
            bottom: 6,
            fontSize: "0.625rem",
            letterSpacing: "0.06em",
            color: "#FAF9F7",
            fontVariantNumeric: "tabular-nums",
            backgroundColor: "rgba(8, 8, 8, 0.7)",
            padding: "1px 5px",
            lineHeight: 1.3,
          }}
        >
          {duration}
        </span>
      )}
    </a>
  )
}
