/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0f0a',
          panel: '#0d1a0d',
          border: '#1a4a1a',
          green: '#00ff41',
          'green-dim': '#00a829',
          'green-dark': '#003310',
          amber: '#ffb000',
          'amber-dark': '#332400',
          red: '#ff3333',
          'red-dark': '#330a0a',
          yellow: '#ffd700',
          cyan: '#00e5ff',
          text: '#c8ffc8',
          'text-dim': '#4a7a4a',
          'text-bright': '#ffffff',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"VT323"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        'xs-mono': ['20px', '1.55'],
        'sm-mono': ['23px', '1.5'],
        'base-mono': ['22px', '1.5'],
        'lg-mono': ['26px', '1.4'],
        'xl-mono': ['32px', '1.4'],
        '2xl-mono': ['40px', '1.3'],
        '3xl-mono': ['52px', '1.2'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'blink-fast': 'blink 0.4s step-end infinite',
        glitch: 'glitch 0.3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scan-line': 'scan-line 8s linear infinite',
        'type-cursor': 'blink 0.8s step-end infinite',
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)', filter: 'none' },
          '20%': { transform: 'translate(-2px, 1px)', filter: 'hue-rotate(90deg)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, 2px)', filter: 'hue-rotate(-90deg)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
      },
      boxShadow: {
        terminal: '0 0 8px rgba(0,255,65,0.25), inset 0 0 8px rgba(0,255,65,0.04)',
        'terminal-strong': '0 0 16px rgba(0,255,65,0.4), inset 0 0 16px rgba(0,255,65,0.08)',
        'terminal-red': '0 0 8px rgba(255,51,51,0.35), inset 0 0 8px rgba(255,51,51,0.07)',
        'terminal-amber': '0 0 8px rgba(255,176,0,0.3)',
      },
    },
  },
  plugins: [],
}
