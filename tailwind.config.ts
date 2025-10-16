import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Instrument Serif', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spin-reverse 25s linear infinite',
        'shine': 'shine 5s linear infinite',
        'heartbeat': 'heartbeat 1s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'shine': {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
        'heartbeat': {
          '0%': { 
            transform: 'scale(1)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'scale(1.15)',
            opacity: '1'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '0.7'
          },
        },
      }
    },
  },
  plugins: [],
}

export default config