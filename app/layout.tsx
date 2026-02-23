import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'DayShare - Family Hub',
  description: 'Share your day with your family. A private hub for your family to stay connected.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Navbar />
        <main className="min-h-screen bg-[#F9F7F4]">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
