/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3BAAB8',
        secondary: '#F471B5',
        accent: '#A3E7F0',
        'text-primary': '#F1F5F9',
        'text-secondary': '#C1C2C5',
        'bg-dark': '#080A0C',
        'bg-card': 'rgba(255,255,255,0.02)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 170, 184, 0.3)',
        glowMagenta: '0 0 20px rgba(244, 113, 181, 0.3)',
        innerGlow: 'inset 0 0 20px rgba(255,255,255,0.03)',
      },
      animation: {
        'float-glow1': 'floatGlow1 40s ease-in-out infinite',
        'float-glow2': 'floatGlow2 50s ease-in-out infinite',
        'float-glow3': 'floatGlow3 45s ease-in-out infinite',
        'fade-glow1': 'fadeGlow 15s ease-in-out infinite',
        'fade-glow2': 'fadeGlow 20s ease-in-out infinite 5s',
        'fade-glow3': 'fadeGlow 18s ease-in-out infinite 10s',
      },
      keyframes: {
        floatGlow1: {
          '0%': {
            transform: 'translate(-50%, -50%) translate(0px, 0px)',
          },
          '25%': {
            transform: 'translate(-50%, -50%) translate(300px, -200px)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) translate(-250px, 250px)',
          },
          '75%': {
            transform: 'translate(-50%, -50%) translate(200px, 150px)',
          },
          '100%': {
            transform: 'translate(-50%, -50%) translate(0px, 0px)',
          },
        },
        floatGlow2: {
          '0%': {
            transform: 'translate(25%, 25%) translate(0px, 0px)',
          },
          '33%': {
            transform: 'translate(25%, 25%) translate(-300px, -250px)',
          },
          '66%': {
            transform: 'translate(25%, 25%) translate(250px, -200px)',
          },
          '100%': {
            transform: 'translate(25%, 25%) translate(0px, 0px)',
          },
        },
        floatGlow3: {
          '0%': {
            transform: 'translate(-25%, -25%) translate(0px, 0px)',
          },
          '33%': {
            transform: 'translate(-25%, -25%) translate(300px, 300px)',
          },
          '66%': {
            transform: 'translate(-25%, -25%) translate(-250px, -200px)',
          },
          '100%': {
            transform: 'translate(-25%, -25%) translate(0px, 0px)',
          },
        },
        fadeGlow: {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(59, 170, 184, 0.25), transparent 70%)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};