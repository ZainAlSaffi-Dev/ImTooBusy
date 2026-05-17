/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          // Warm dark backgrounds — not pure black, slight warmth like a real
          // material. Inspired by Linear / paco.me / rauno.me.
          0:   '#0E0D0C', // page background (warm near-black)
          50:  '#141312', // alt page background
          100: '#1A1816', // surface (cards, panels)
          200: '#22201E', // raised surface
          300: '#2A2724', // hairline border / hover surface
          400: '#3A352F', // stronger border
          500: '#5A544A', // deep muted
          600: '#7A7367', // muted secondary text
          700: '#9A9285', // muted body text
          800: '#C8BFAF', // body text
          900: '#EDE6D7', // headline text — warm off-white
        },
        accent: {
          DEFAULT: '#C9A36C', // warm tan / muted amber — single accent
          soft:    '#E2C39A',
          deep:    '#A07F4F',
        },
        // Keep `carbon-*` aliases pointing to the new palette so that any
        // old usages don't crash mid-build while we replace them.
        carbon: {
          bg:        '#0E0D0C',
          panel:     '#1A1816',
          primary:   '#C9A36C',
          secondary: '#E2C39A',
          text:      '#EDE6D7',
          muted:     '#7A7367',
        },
      },
      fontFamily: {
        // Editorial serif for the name and a few accents
        serif: ['"Instrument Serif"', 'Cambria', 'Georgia', 'serif'],
        // Clean sans for everything else
        sans:  ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        // Mono used only for tiny captions, dates, labels
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        'tightish': '-0.012em',
        'tighter2': '-0.025em',
      },
      maxWidth: {
        'reading': '62ch',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
