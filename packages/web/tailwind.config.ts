import { join } from 'path'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
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
