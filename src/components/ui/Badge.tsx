import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  color?: 'cyan' | 'purple' | 'green' | 'yellow' | 'red' | 'gray' | 'orange'
  className?: string
}

const colorClasses: Record<string, string> = {
  cyan: 'bg-cyan-900/50 text-cyan-300 border border-cyan-700',
  purple: 'bg-purple-900/50 text-purple-300 border border-purple-700',
  green: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700',
  yellow: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
  red: 'bg-red-900/50 text-red-300 border border-red-700',
  gray: 'bg-gray-800 text-gray-400 border border-gray-600',
  orange: 'bg-orange-900/50 text-orange-300 border border-orange-700',
}

export default function Badge({ children, color = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  )
}
