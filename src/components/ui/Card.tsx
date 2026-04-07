import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export default function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-xl p-4 ${glow ? 'shadow-lg shadow-signal/20' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
