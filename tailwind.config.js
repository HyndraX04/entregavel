/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070709',
          900: '#0c0c10',
          850: '#111116',
          800: '#16161e',
          750: '#1c1c26',
          700: '#242432',
          600: '#323244',
        },
        gold: {
          50: '#fffdf5',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 35px -5px rgba(234, 179, 8, 0.25)',
        'glow-subtle': '0 0 20px -3px rgba(234, 179, 8, 0.15)',
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)',
        'dark-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
