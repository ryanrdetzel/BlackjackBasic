/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          felt: '#0B6536',
          'felt-dark': '#084528',
          gold: '#FFD700',
          'gold-light': '#FFED4E',
          'gold-dark': '#B8860B',
          chip: {
            white: '#FFFFFF',
            red: '#DC2626',
            green: '#16A34A',
            blue: '#2563EB',
            black: '#000000',
          }
        }
      },
      fontFamily: {
        'casino': ['Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'chip': '0 2px 4px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

