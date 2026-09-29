/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f172a',
          blue: '#1e3a8a',
          hover: '#1e40af',
          muted: '#64748b',
          border: '#e2e8f0',
          bg: '#f8fafc',
          green: '#166534',
          red: '#991b1b',
          saffron: '#f97316',
        },
        bhu: {
          bg: '#F4F7F9',
          navbar: '#FFFFFF',
          sidebar: '#F1F6F6',
          cards: '#FFFFFF',
          'primary-text': '#0F172A',
          'secondary-text': '#475569',
          'muted-text': '#64748B',
          primary: '#008B72',
          dark: '#00695C',
          light: '#E8F7F3',
          blue: '#2563EB',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
