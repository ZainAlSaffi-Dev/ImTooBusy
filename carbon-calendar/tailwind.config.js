/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          bg: '#050505',       // Pure Void Black (Infinite Tsukuyomi vibes)
          panel: '#120a1a',    // Very dark purple-grey for cards
          primary: '#a855f7',  // Susanoo Purple (Glowing Violet)
          secondary: '#e9d5ff', // Rinnegan Lavender (Pale, ghostly)
          text: '#f3e8ff',     // Very light purple-white
          muted: '#6b4c7d',    // Muted purple-grey for secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}