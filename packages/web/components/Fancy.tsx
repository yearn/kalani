import localFont from 'next/font/local'
import Scanlines from './Screen/Scanlines'

const sans = localFont({
  variable: '--font-venusrising-sans',
  display: 'swap',
  src: [
    { path: '../app/fonts/VenusRisingRegular/font.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/VenusRisingRegular/font.woff', weight: '400', style: 'normal' },
    { path: '../app/fonts/VenusRisingBold/font.woff2', weight: '700', style: 'normal' },
    { path: '../app/fonts/VenusRisingBold/font.woff', weight: '700', style: 'normal' },
    { path: '../app/fonts/VenusRisingHeavy/font.woff2', weight: '900', style: 'normal' },
    { path: '../app/fonts/VenusRisingHeavy/font.woff', weight: '900', style: 'normal' }
  ]})

export default function Fancy({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={`
  text-transparent bg-clip-text bg-clip-text
  bg-gradient-to-r from-neutral-400 from-10% via-neutral-200 via-30% to-[#5a3c34]
  drop-shadow-fancy
  ${sans.className} ${className}`}>
    {children}
  </div>
}
