import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - Premium Choice Real Estate',
  description: 'Admin panel for managing Premium Choice Real Estate website',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}