import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantClasses: Record<string, string> = {
  primary: 'bg-signal text-black font-semibold hover:bg-cyan-300 active:bg-cyan-400',
  secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600',
  ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white',
  danger: 'bg-danger text-white hover:bg-red-500 active:bg-red-600',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
