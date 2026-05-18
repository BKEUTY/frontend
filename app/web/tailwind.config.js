/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Aggressive CSS purging - remove unused utilities
  safelist: [
    // Only whitelist styles that are dynamically applied
    'hidden',
    'block',
    'flex',
    'grid',
  ],
}
