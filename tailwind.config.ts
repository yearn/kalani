import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import Theme from 'tailwindcss/defaultTheme'

export const primary = {
  ...colors.orange, 
  '1000': '#170602'
}

export const secondary = {
  '50': '#fdfdf1',
  '100': '#f7f7ce',
  '200': '#efee98',
  '300': '#e6e163',
  '400': '#e0d33f',
  '500': '#d8ba28',
  '600': '#bf9520',
  '700': '#9f701e',
  '800': '#82581e',
  '900': '#6b491c',
  '950': '#3d260b'
}

const config = {
  darkMode: ['class'],
  prefix: '',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    'scrollbar-thumb-pink-500'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary,
        secondary
      },

      width: {
        'field-btn': '8rem',
      },

      height: {
        'field-btn': '54px',
      },

      borderRadius: {
        primary: Theme.borderRadius.xl
      },

      dropShadow: {
				'fancy': [
					'0 0 16px rgba(255, 255, 255, 0.16)',
					'0 0 4px rgba(255, 255, 255, 0.1)'
				]
			},

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

        grid: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },

      animation: {
        'atmospheric-pulse': 'pulse 30s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down': 'accordion-down 0.1s ease-out',
        'accordion-up': 'accordion-up 0s ease-out',

        'grid': 'grid 120s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
} satisfies Config

export default config
