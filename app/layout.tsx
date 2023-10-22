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
        <nav className='flex px-10 py-4 bg-gray-200'>
          <h1 className='font-bold text-2xl tracking-tighter'>
            Logic <span className='text-purple-600'>Flow</span>
          </h1>
        </nav>
        <div className=''>{children}</div>
      </body>
    </html>
  )
}
