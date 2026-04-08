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
        background:     '#080808',
        surface:        '#111110',
        'surface-soft': '#0D0D0C',
        'surface-raised': '#1A1918',
        border:         '#2D2A27',

        /* ── Text hierarchy ──────────────────────────────────────── */
        'text-primary':   '#F2EDE4',
        'text-secondary': '#A09890',
        'text-tertiary':  '#6E6762',

        /* ── Accents ─────────────────────────────────────────────── */
        gold:    '#C9922A',
        'gold-dim': '#7A5A1A',
        signal:  '#1F4D3A',

        /* ── Legacy aliases (for backward compat) ────────────────── */
        ink:          '#080808',
        paper:        '#F2EDE4',
        'paper-dark': '#111110',
        muted:        '#A09890',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
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
