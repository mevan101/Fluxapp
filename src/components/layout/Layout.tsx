import React from 'react'
import Navigation from './Navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-gray-100">
      <Navigation />
      <main className="pt-14">{children}</main>
    </div>
  )
}
