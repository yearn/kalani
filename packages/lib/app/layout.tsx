import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import './globals.css'

const mono = Roboto_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kalani Lib',
  description: 'Kalani shared resources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mono.className}`}>
      <body className="font-mono">
        {children}
      </body>
    </html>
  )
}
