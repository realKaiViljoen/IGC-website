import { type Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Dark theme base ─────────────────────────────────────── */
        background:     '#0A0B0E',
        surface:        '#101215',
        'surface-soft': '#0D0D0C',
        'surface-raised': '#1A1918',
        border:         '#2D2A27',

        /* ── Text hierarchy ──────────────────────────────────────── */
        /* text-tertiary bumped from #93918E → #93918E (WCAG AA on #0A0B0E, */
        /* matches marketing site --ink-3). See DESIGN.md typography notes. */
        'text-primary':   '#FAF9F7',
        'text-secondary': '#A8A6A3',
        'text-mid':       '#E7E5E2',
        'text-tertiary':  '#93918E',

        /* ── Accents ─────────────────────────────────────────────── */
        gold:    '#C78B28',
        'gold-dim': '#7A5A1A',
        signal:  '#1F4D3A',

        /* ── Legacy aliases (for backward compat) ────────────────── */
        ink:          '#0A0B0E',
        paper:        '#FAF9F7',
        'paper-dark': '#101215',
        muted:        '#A8A6A3',
      },
      fontFamily: {
        /* Single canonical stack — matches marketing site (igc-growth.com). */
        display: ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans:    ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(6rem, 16vw, 16rem)',           { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(4rem, 9vw, 8rem)',             { lineHeight: '1.0',  letterSpacing: '-0.03em' }],
        'display-lg':  ['clamp(2.75rem, 5.5vw, 5rem)',        { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md':  ['clamp(1.875rem, 3.5vw, 3.25rem)',    { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        'display-sm':  ['clamp(1.375rem, 2.2vw, 1.875rem)', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'body-lg':     ['1.5rem',    { lineHeight: '1.75' }],
        'body-md':     ['1.25rem',   { lineHeight: '1.7'  }],
        'label':       ['0.6875rem', { lineHeight: '1', letterSpacing: '0.16em' }],
      },
      maxWidth: {
        site:  '1200px',
        prose: '680px',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
} satisfies Config
