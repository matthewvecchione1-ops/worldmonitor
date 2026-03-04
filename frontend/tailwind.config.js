/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background hierarchy (darkest to lightest)
        void: '#05080F',
        deep: '#080D18',
        surface: '#0C1422',
        raised: '#111D30',
        elevated: '#172338',

        // Border hierarchy
        border: {
          DEFAULT: '#1C2C42',
          hi: '#243650',
          glo: '#2E4A6A',
        },

        // Text hierarchy
        txt: {
          1: '#ECF0F8',
          2: '#8CA0BC',
          3: '#4E6480',
          4: '#2A3C52',
        },

        // Severity palette
        crit: '#FF2040',
        high: '#FF6020',
        mod: '#F5A020',
        low: '#4E6480',
        info: '#1A8FFF',

        // Functional colors
        live: '#00F080',
        pos: '#00D878',
        neg: '#FF2040',
        acc: '#00CCFF',

        // Domain colors
        mil: '#FF2040',
        pol: '#1A8FFF',
        eco: '#00D878',
        cyb: '#CC44FF',
        env: '#FF9000',
        nuc: '#FFD000',
        sea: '#00AAFF',
        air: '#55CCFF',
      },

      fontFamily: {
        dis: ['Rajdhani', 'sans-serif'],
        bod: ['DM Sans', 'sans-serif'],
        mon: ['JetBrains Mono', 'monospace'],
      },

      spacing: {
        gap: '6px',
        pad: '14px',
        'bar-h': '48px',
        'sb-w': '52px',
        'rail-w': '296px',
      },

      borderRadius: {
        wim: '5px',
      },

      keyframes: {
        barDrop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        feedIn: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        leafPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        scrollHint: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },

      animation: {
        barDrop: 'barDrop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        feedIn: 'feedIn 400ms ease-out forwards',
        blink: 'blink 1.4s ease infinite',
        leafPulse: 'leafPulse 2s ease infinite',
        scrollHint: 'scrollHint 1.5s ease infinite',
      },
    },
  },
  plugins: [],
}
