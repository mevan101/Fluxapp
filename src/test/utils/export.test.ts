import { describe, it, expect } from 'vitest'
import { circuitToSvg } from '../../utils/export'
import { AND_GATE_DEMO, HALF_ADDER_DEMO } from '../../data/sampleCircuits'
import { Circuit } from '../../types/circuit'

describe('circuitToSvg', () => {
  it('returns a valid SVG string for a non-empty circuit', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    expect(svg).toContain('<?xml version="1.0"')
    expect(svg).toContain('<svg ')
    expect(svg).toContain('</svg>')
  })

  it('includes the FLUX watermark', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    expect(svg).toContain('FLUX Circuit Simulator')
  })

  it('includes a background rect', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    expect(svg).toContain('#0a0c10')
  })

  it('includes component body rectangles', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    expect(svg).toContain('1a1f2e') // component fill color
  })

  it('handles an empty circuit without throwing', () => {
    const empty: Circuit = {
      id: 'empty',
      name: 'Empty',
      components: [],
      wires: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    }
    expect(() => circuitToSvg(empty)).not.toThrow()
    const svg = circuitToSvg(empty)
    expect(svg).toContain('<svg ')
  })

  it('produces valid SVGs for circuits with more components', () => {
    const svg1 = circuitToSvg(AND_GATE_DEMO)
    const svg2 = circuitToSvg(HALF_ADDER_DEMO)
    expect(svg1).toContain('<svg ')
    expect(svg2).toContain('<svg ')
  })

  it('includes wire paths for circuits with wires', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    if (AND_GATE_DEMO.wires.length > 0) {
      expect(svg).toContain('<path ')
    }
  })

  it('includes glow filter in defs', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    expect(svg).toContain('filter id="glow"')
    expect(svg).toContain('feGaussianBlur')
  })

  it('includes a grid pattern in defs', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    expect(svg).toContain('pattern id="grid"')
  })

  it('has valid viewBox with positive dimensions', () => {
    const svg = circuitToSvg(AND_GATE_DEMO)
    const match = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/)
    expect(match).not.toBeNull()
    if (match) {
      expect(parseFloat(match[1])).toBeGreaterThan(0)
      expect(parseFloat(match[2])).toBeGreaterThan(0)
    }
  })

  it('renders active (signal=1) wires with cyan color', () => {
    const circuit: Circuit = {
      ...AND_GATE_DEMO,
      wires: AND_GATE_DEMO.wires.map(w => ({ ...w, signal: 1 as const })),
    }
    const svg = circuitToSvg(circuit)
    if (circuit.wires.length > 0) {
      expect(svg).toContain('#00d4ff')
    }
  })

  it('renders inactive (signal=0) wires with dark gray color', () => {
    const circuit: Circuit = {
      ...AND_GATE_DEMO,
      wires: AND_GATE_DEMO.wires.map(w => ({ ...w, signal: 0 as const })),
    }
    const svg = circuitToSvg(circuit)
    if (circuit.wires.length > 0) {
      expect(svg).toContain('#374151')
    }
  })
})
