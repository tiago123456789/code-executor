import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "bootstrap/dist/css/bootstrap.min.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Code executor - Create new script',
  description: 'Create new script to trigger via cronjob or http',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
