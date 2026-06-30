/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // viz teal accent
        accent: {
          DEFAULT: '#2DD4BF',
          soft: '#5EEAD4',
          dim: '#14B8A6',
        },
        ink: {
          // charcoal surfaces (dark theme)
          900: '#0A0E14',
          800: '#0F141C',
          700: '#161D27',
          600: '#1E2733',
          500: '#2A3645',
        },
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45,212,191,0.25), 0 8px 40px -12px rgba(45,212,191,0.35)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
