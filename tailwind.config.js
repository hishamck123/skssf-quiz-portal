/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E', // Primary
          light: '#14B8A6', // Secondary
        },
        accent: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: '#F8FAFC',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
