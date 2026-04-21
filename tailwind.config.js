/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        surfaceHover: '#2A2A2A',
        primary: '#FF5722',
        primaryHover: '#E64A19',
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
        success: '#25D366',
        successHover: '#1DA851'
      },
      fontFamily: {
        sans: ['"Work Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
