/** @type {import('tailwindcss').Config} */
// Colors are the original kasi.kasion.dev theme: GitHub-dark surfaces + amber brand.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#0d1117',
          900: '#161b22',
          800: '#21262d',
          700: '#30363d',
          600: '#484f58',
          500: '#6e7681',
          400: '#8b949e',
          300: '#b1bac4',
          200: '#c9d1d9',
          100: '#f0f6fc',
        },
        brand: {
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
          hover: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
