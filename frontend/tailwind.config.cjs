/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Brand palette
        brand: {
          indigo:  '#6366f1',
          violet:  '#8b5cf6',
          cyan:    '#22d3ee',
          emerald: '#34d399',
          rose:    '#fb7185',
          amber:   '#fbbf24',
        },
        // Surface system (dark-first)
        surface: {
          base:     '#080d1a',
          card:     '#0c1220',
          elevated: '#111827',
          glass:    'rgba(255,255,255,0.03)',
        },
        // Text system
        ink: {
          primary:   '#e8eeff',
          secondary: '#94a3b8',
          muted:     '#64748b',
          faint:     '#334155',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-indigo': `
          radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.1) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 100%, rgba(139,92,246,0.08) 0%, transparent 60%)
        `,
      },
      borderColor: {
        glass:       'rgba(255,255,255,0.06)',
        'indigo-dim':'rgba(99,102,241,0.15)',
        'indigo-glow':'rgba(99,102,241,0.35)',
      },
      boxShadow: {
        'glass':    '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card':     '0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,102,241,0.08)',
        'card-lg':  '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.12)',
        'indigo':   '0 0 24px rgba(99,102,241,0.35)',
        'indigo-lg':'0 0 48px rgba(99,102,241,0.3)',
        'violet':   '0 0 24px rgba(139,92,246,0.35)',
        'cyan':     '0 0 24px rgba(34,211,238,0.25)',
        'emerald':  '0 0 24px rgba(52,211,153,0.25)',
        'rose':     '0 0 24px rgba(251,113,133,0.3)',
        'btn-primary': '0 4px 15px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      animation: {
        'fade-up':       'fadeUp 0.4s ease forwards',
        'fade-in':       'fadeIn 0.3s ease forwards',
        'scale-in':      'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right':   'slideInRight 0.35s ease forwards',
        'slide-left':    'slideInLeft 0.35s ease forwards',
        'shimmer':       'shimmer 1.8s ease-in-out infinite',
        'orb-float':     'orbFloat 20s ease-in-out infinite',
        'pulse-ring':    'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'dot-bounce':    'dotBounce 1.4s ease-in-out infinite',
        'progress-fill': 'progressFill 1s cubic-bezier(0.16,1,0.3,1) forwards',
        'ripple':        'ripple 0.6s ease-out',
        'float':         'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:        { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:        { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:       { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideInRight:  { from: { opacity: '0', transform: 'translateX(20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInLeft:   { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer:       { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        orbFloat:      { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(30px,-30px) scale(1.05)' }, '66%': { transform: 'translate(-20px,20px) scale(0.97)' } },
        pulseRing:     { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        dotBounce:     { '0%,80%,100%': { transform: 'translateY(0)', opacity: '0.5' }, '40%': { transform: 'translateY(-6px)', opacity: '1' } },
        progressFill:  { from: { width: '0%' } },
        ripple:        { '0%': { transform: 'scale(0)', opacity: '0.6' }, '100%': { transform: 'scale(2.5)', opacity: '0' } },
        float:         { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '4px',
        '2xl': '40px',
        '3xl': '60px',
      },
    },
  },
  plugins: [],
}
