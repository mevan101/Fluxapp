import { describe, it, expect } from 'vitest'
import {
  AND_GATE_DEMO,
  SR_LATCH_DEMO,
  D_FLIP_FLOP_DEMO,
  HALF_ADDER_DEMO,
  XOR_GATE_DEMO,
  SAMPLE_CIRCUITS,
} from '../../data/sampleCircuits'
import { Circuit } from '../../types/circuit'

function validateCircuit(circuit: Circuit) {
  // Each wire's fromComponentId and toPinId must reference existing components/pins
  const compMap = new Map(circuit.components.map(c => [c.id, c]))

  for (const wire of circuit.wires) {
    const fromComp = compMap.get(wire.fromComponentId)
    const toComp = compMap.get(wire.toComponentId)

    expect(fromComp, `wire ${wire.id}: fromComponentId ${wire.fromComponentId} not found`).toBeDefined()
    expect(toComp, `wire ${wire.id}: toComponentId ${wire.toComponentId} not found`).toBeDefined()

    const fromPin = fromComp?.pins.find(p => p.id === wire.fromPinId)
    const toPin = toComp?.pins.find(p => p.id === wire.toPinId)

    expect(fromPin, `wire ${wire.id}: fromPinId ${wire.fromPinId} not found`).toBeDefined()
    expect(toPin, `wire ${wire.id}: toPinId ${wire.toPinId} not found`).toBeDefined()

    // Wires must go from output to input
    expect(fromPin?.type, `wire ${wire.id}: source pin must be output`).toBe('output')
    expect(toPin?.type, `wire ${wire.id}: target pin must be input`).toBe('input')
  }
}

describe('SAMPLE_CIRCUITS collection', () => {
  it('exports exactly 5 sample circuits', () => {
    expect(SAMPLE_CIRCUITS).toHaveLength(5)
  })

  it('all circuits have unique IDs', () => {
    const ids = SAMPLE_CIRCUITS.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all circuits have non-empty names', () => {
    for (const c of SAMPLE_CIRCUITS) {
      expect(c.name.length).toBeGreaterThan(0)
    }
  })

  it('all circuits have a valid viewport', () => {
    for (const c of SAMPLE_CIRCUITS) {
      expect(typeof c.viewport.x).toBe('number')
      expect(typeof c.viewport.y).toBe('number')
      expect(c.viewport.zoom).toBeGreaterThan(0)
    }
  })
})

describe('AND_GATE_DEMO', () => {
  it('has the correct id and name', () => {
    expect(AND_GATE_DEMO.id).toBe('demo-and-gate')
    expect(AND_GATE_DEMO.name).toBe('AND Gate Demo')
  })

  it('has exactly 4 components', () => {
    expect(AND_GATE_DEMO.components).toHaveLength(4)
  })

  it('has exactly 3 wires', () => {
    expect(AND_GATE_DEMO.wires).toHaveLength(3)
  })

  it('all wire references are valid', () => {
    validateCircuit(AND_GATE_DEMO)
  })

  it('includes SWITCH, AND, and LED components', () => {
    const types = AND_GATE_DEMO.components.map(c => c.type)
    expect(types).toContain('SWITCH')
    expect(types).toContain('AND')
    expect(types).toContain('LED')
  })

  it('all wires have non-empty paths', () => {
    for (const wire of AND_GATE_DEMO.wires) {
      expect(wire.path.length).toBeGreaterThan(0)
    }
  })
})

describe('SR_LATCH_DEMO', () => {
  it('has the correct id and name', () => {
    expect(SR_LATCH_DEMO.id).toBe('demo-sr-latch')
  })

  it('all wire references are valid', () => {
    validateCircuit(SR_LATCH_DEMO)
  })

  it('includes NOR gates for the latch feedback', () => {
    const types = SR_LATCH_DEMO.components.map(c => c.type)
    const norCount = types.filter(t => t === 'NOR').length
    expect(norCount).toBe(2)
  })

  it('has cross-coupled feedback wires', () => {
    // Should have at least 2 wires from NOR outputs back as inputs
    expect(SR_LATCH_DEMO.wires.length).toBeGreaterThanOrEqual(6)
  })
})

describe('D_FLIP_FLOP_DEMO', () => {
  it('has the correct id', () => {
    expect(D_FLIP_FLOP_DEMO.id).toBe('demo-d-flipflop')
  })

  it('all wire references are valid', () => {
    validateCircuit(D_FLIP_FLOP_DEMO)
  })

  it('includes D_FLIP_FLOP and CLOCK components', () => {
    const types = D_FLIP_FLOP_DEMO.components.map(c => c.type)
    expect(types).toContain('D_FLIP_FLOP')
    expect(types).toContain('CLOCK')
  })
})

describe('HALF_ADDER_DEMO', () => {
  it('has the correct id', () => {
    expect(HALF_ADDER_DEMO.id).toBe('demo-half-adder')
  })

  it('all wire references are valid', () => {
    validateCircuit(HALF_ADDER_DEMO)
  })

  it('includes HALF_ADDER component', () => {
    const types = HALF_ADDER_DEMO.components.map(c => c.type)
    expect(types).toContain('HALF_ADDER')
  })
})

describe('XOR_GATE_DEMO', () => {
  it('has the correct id', () => {
    expect(XOR_GATE_DEMO.id).toBe('demo-xor-gate')
  })

  it('all wire references are valid', () => {
    validateCircuit(XOR_GATE_DEMO)
  })

  it('includes XOR component', () => {
    const types = XOR_GATE_DEMO.components.map(c => c.type)
    expect(types).toContain('XOR')
  })
})
