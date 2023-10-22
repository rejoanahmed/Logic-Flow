import Navabr from 'components/Navabr'
import './global.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Logic Flow',
  description:
    'Build logic flows with ease and share them with others or collaborate in real-time.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Navabr />
        <div className=''>{children}</div>
      </body>
    </html>
  )
}
