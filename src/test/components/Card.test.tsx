import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../../components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Hello</p></Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders as a div', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild?.nodeName.toLowerCase()).toBe('div')
  })

  it('has default background and border classes', () => {
    const { container } = render(<Card>Content</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('bg-gray-900')
    expect(div.className).toContain('border-gray-700')
  })

  it('does not apply glow class by default', () => {
    const { container } = render(<Card>Content</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).not.toContain('shadow-signal')
  })

  it('applies glow classes when glow=true', () => {
    const { container } = render(<Card glow>Content</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('shadow-signal')
  })

  it('merges custom className', () => {
    const { container } = render(<Card className="my-card">Content</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('my-card')
  })

  it('renders multiple children', () => {
    render(
      <Card>
        <span>Child 1</span>
        <span>Child 2</span>
      </Card>
    )
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })
})
