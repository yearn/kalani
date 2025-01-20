import colors from 'tailwindcss/colors'
import Theme from 'tailwindcss/defaultTheme'
import animate from 'tailwindcss-animate'

function heightSafeList() {
  const maxheight = 101;
  return Array(maxheight).fill(0).map((_, index) => `h-[${index}%]`);
}

export const primary = {
  ...colors.orange,
  '1000': '#281004',
  '1500': '#170602',
  '2000': '#040200'
}

export const secondary = {
  ...colors.violet,
  '1000': '#161622',
  '1500': '#0b0b12',
  '2000': '#09090c'
}

export default {
  darkMode: ['class'],
  prefix: '',
  content: [ './src/**/*.{html,js,jsx,ts,tsx}' ],
  safelist: [
    ...heightSafeList(),
    'w-[24px]', 'h-[24px]',
    'w-[28px]', 'h-[28px]',
    'w-[32px]', 'h-[32px]',
    'w-[48px]', 'h-[48px]',
    'w-[64px]', 'h-[64px]',
    'border-primary',
    'odd:bg-grill-900'
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
      fontFamily: {
        'fancy': ['Venus Rising', 'sans-serif'],
      },

      colors: {
        primary,
        secondary,
        warn: colors.yellow,
        error: colors.red,
      },

      width: {
        'field-btn': '8rem'
      },

      height: {
        'field-btn': '50px',
      },

      borderWidth: {
        primary: Theme.borderWidth['4']
      },

      borderRadius: {
        primary: Theme.borderRadius['xl']
      },

      gap: {
        primary: Theme.spacing['8']
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

				gradient: {
  				to: {
  					backgroundPosition: 'var(--bg-size) 0'
  				}
  			},
      },

      animation: {
        'atmospheric-pulse': 'pulse 30s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down': 'accordion-down 0.1s ease-out',
        'accordion-up': 'accordion-up 0s ease-out',
        'grid': 'grid 120s linear infinite',
				gradient: 'gradient 8s linear infinite'
      },
    },
  },
  plugins: [animate]
}
