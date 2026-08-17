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
          DEFAULT: '#0052cc', // Vibrant Blue matching the image
          light: '#3377ff',
          dark: '#003d99',
          50: '#eef4ff',
        },
        secondary: {
          DEFAULT: '#f4f7fb', // Light grayish blue background
          dark: '#e2e8f0',
        },
        dark: {
          DEFAULT: '#0b1325', // Deep navy for hero/footer
          light: '#15203b',
          card: '#111c33',
        },
        accent: {
          pink: '#ec4899', // For "Most Popular"
          green: '#10b981', // For "Eco Friendly"
          purple: '#8b5cf6', // For "10% off banner"
          yellow: '#f59e0b', // For stars
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
        'blue-glow': '0 10px 25px -5px rgba(0, 82, 204, 0.4)', // For primary buttons
      }
    },
  },
  plugins: [],
}
