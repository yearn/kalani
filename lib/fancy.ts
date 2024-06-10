import localFont from 'next/font/local'

export const fancy = localFont({
  variable: '--font-venusrising-sans',
  display: 'swap',
  src: [
    { path: '../app/fonts/VenusRisingRegular/font.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/VenusRisingRegular/font.woff', weight: '400', style: 'normal' },
    { path: '../app/fonts/VenusRisingBold/font.woff2', weight: '700', style: 'normal' },
    { path: '../app/fonts/VenusRisingBold/font.woff', weight: '700', style: 'normal' },
    { path: '../app/fonts/VenusRisingHeavy/font.woff2', weight: '900', style: 'normal' },
    { path: '../app/fonts/VenusRisingHeavy/font.woff', weight: '900', style: 'normal' }
  ]
})
