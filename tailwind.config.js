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
          DEFAULT: '#0f172a', // Premium Slate 900 (almost black)
          light: '#334155',
          dark: '#020617',
        },
        secondary: {
          DEFAULT: '#f8fafc', // Pristine Slate 50
          dark: '#e2e8f0',
        },
        dark: {
          DEFAULT: '#0f172a',
          light: '#334155',
        },
        accent: {
          DEFAULT: '#2563eb', // Rich Royal Blue (Blue 600) for vibrant pops
        },
        danger: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
