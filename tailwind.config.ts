import { join } from 'path'
import type { Config } from 'tailwindcss'

const config: Config = {
	presets: [require('@yearn-finance/web-lib/tailwind.config.cjs')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'components', '**', '*.{js,ts,jsx,tsx}'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'contexts', '**', '*.{js,ts,jsx,tsx}'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'hooks', '**', '*.{js,ts,jsx,tsx}'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'icons', '**', '*.{js,ts,jsx,tsx}'),
		join(__dirname, 'node_modules', '@yearn-finance', 'web-lib', 'utils', '**', '*.{js,ts,jsx,tsx}')
  ],
  theme: {
    extend: {
			borderRadius: {
				DEFAULT: 'var(--default-rounded)'
			},
			colors: {
				'orange': {
					'50': '#fff1ed',
					'100': '#ffded5',
					'200': '#febcaa',
					'300': '#fd9274',
					'400': '#fb653c',
					'500': '#f94716',
					'600': '#ea3c0c',
					'700': '#c2330c',
					'800': '#9a2f12',
					'900': '#7c2912',
					'950': '#431407',
					'1000': '#210903',
					'2000': '#170602'
				},
				'violet': {
					'50': '#f7f3ff',
					'100': '#efe9fe',
					'200': '#e2d6fe',
					'300': '#cbb5fd',
					'400': '#ad8bfa',
					'500': '#8b5cf6',
					'600': '#713aed',
					'700': '#5e28d9',
					'800': '#4e21b6',
					'900': '#421d95',
					'950': '#2a1065',
				},
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
