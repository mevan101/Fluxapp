import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '../../components/ui/Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('defaults to gray color', () => {
    render(<Badge>Gray</Badge>)
    expect(screen.getByText('Gray').className).toContain('bg-gray-800')
  })

  it('applies cyan color classes', () => {
    render(<Badge color="cyan">Cyan</Badge>)
    expect(screen.getByText('Cyan').className).toContain('bg-cyan-900')
  })

  it('applies purple color classes', () => {
    render(<Badge color="purple">Purple</Badge>)
    expect(screen.getByText('Purple').className).toContain('bg-purple-900')
  })

  it('applies green color classes', () => {
    render(<Badge color="green">Green</Badge>)
    expect(screen.getByText('Green').className).toContain('bg-emerald-900')
  })

  it('applies yellow color classes', () => {
    render(<Badge color="yellow">Yellow</Badge>)
    expect(screen.getByText('Yellow').className).toContain('bg-yellow-900')
  })

  it('applies red color classes', () => {
    render(<Badge color="red">Red</Badge>)
    expect(screen.getByText('Red').className).toContain('bg-red-900')
  })

  it('applies orange color classes', () => {
    render(<Badge color="orange">Orange</Badge>)
    expect(screen.getByText('Orange').className).toContain('bg-orange-900')
  })

  it('merges custom className', () => {
    render(<Badge className="extra-class">Custom</Badge>)
    expect(screen.getByText('Custom').className).toContain('extra-class')
  })

  it('renders as a span element', () => {
    render(<Badge>Span</Badge>)
    expect(screen.getByText('Span').tagName.toLowerCase()).toBe('span')
  })
})
