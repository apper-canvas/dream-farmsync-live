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
          50: '#f0f8e6',
          100: '#daecc0',
          200: '#c2e096',
          300: '#a8d46b',
          400: '#94ca4a',
          500: '#7CB342',
          600: '#6a9a35',
          700: '#567e2a',
          800: '#43621f',
          900: '#2D5016',
        },
        secondary: {
          50: '#fff8f3',
          100: '#ffede0',
          200: '#ffd9c0',
          300: '#ffc194',
          400: '#ffa168',
          500: '#FF6B35',
          600: '#e55a2b',
          700: '#cc4921',
          800: '#b33917',
          900: '#99280d',
        },
        surface: '#F5F5DC',
        background: '#FAFAF8',
      },
      fontFamily: {
        'display': ['DM Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}