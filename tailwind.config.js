/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        display:      ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-xl': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        body:         ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        small:        ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        badge:        ['11px', { lineHeight: '1.2', fontWeight: '600' }],
      },
      colors: {
        surface: {
          primary:  '#0d1117',
          card:     '#161b22',
          elevated: '#21262d',
          overlay:  '#2d333b',
        },
        primary: {
          DEFAULT: '#1a7a4a',
          hover:   '#22a05c',
          dark:    '#0f4d2e',
        },
        border: '#30363d',
        status: {
          ok:       '#4caf50',
          warn:     '#ffb300',
          critical: '#f44336',
          offline:  '#6e7681',
          pregnant: '#ce93d8',
        },
      },
      textColor: {
        primary:   '#e6edf3',
        secondary: '#8b949e',
        muted:     '#6e7681',
        brand:     '#1a7a4a',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
  plugins: [],
}

