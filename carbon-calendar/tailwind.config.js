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
          bg: '#111111',       // Deep Asphalt
          panel: '#1a1a1a',    // Lighter grey for cards
          primary: '#00FFFF',  // Neon Cyan
          secondary: '#FF9900', // Safety Orange
          text: '#E0E0E0',     // Off-white
          muted: '#555555',    // Grey text
        }
      },
      fontFamily: {
        // We'll use the default sans for now, but you can swap this later
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}