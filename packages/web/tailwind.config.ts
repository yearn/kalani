import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import Theme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    '../lib/components/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.yellow
      },
      borderRadius: {
        primary: Theme.borderRadius.xl
      },
			dropShadow: {
				'fancy': [
					'0 0 16px rgba(255, 255, 255, 0.16)',
					'0 0 4px rgba(255, 255, 255, 0.1)'
				]
			}
    },
	},
  plugins: []
}
export default config
