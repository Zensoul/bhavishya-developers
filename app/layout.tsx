import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bhavishya Developers — Members Portal',
  description: 'Exclusive property listings portal for Bhavishya Developers members',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}