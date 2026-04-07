import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSimulation } from '../../hooks/useSimulation'
import { Circuit, CircuitComponent, Pin, Wire } from '../../types/circuit'

// ─── helpers ────────────────────────────────────────────────────────────────

let _id = 1
function uid() { return `t${_id++}` }

function makePin(name: string, type: 'input' | 'output', signal: 0 | 1 = 0): Pin {
  return { id: uid(), name, type, position: { x: 0, y: 0 }, signal }
}

function makeComponent(
  type: CircuitComponent['type'],
  pins: Pin[],
  state: Record<string, unknown> = {},
): CircuitComponent {
  return { id: uid(), type, x: 0, y: 0, width: 80, height: 60, label: type, pins, state }
}

function makeWire(from: CircuitComponent, fromPin: Pin, to: CircuitComponent, toPin: Pin): Wire {
  return {
    id: uid(),
    fromComponentId: from.id,
    fromPinId: fromPin.id,
    toComponentId: to.id,
    toPinId: toPin.id,
    signal: 0,
    path: [],
  }
}

function makeCircuit(components: CircuitComponent[], wires: Wire[] = []): Circuit {
  return { id: uid(), name: 'test', components, wires, viewport: { x: 0, y: 0, zoom: 1 } }
}

// ─── propagateSignals via hook.propagate ────────────────────────────────────

function usePropagator(circuit: Circuit) {
  return useSimulation(circuit)
}

function propagate(circuit: Circuit): Circuit {
  const { result } = renderHook(() => usePropagator(circuit))
  return result.current.propagate(circuit)
}

// ─── AND gate ───────────────────────────────────────────────────────────────

describe('propagateSignals – AND gate', () => {
  it('0,0 → 0', () => {
    const inA = makePin('A', 'input', 0)
    const inB = makePin('B', 'input', 0)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('AND', [inA, inB, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })

  it('1,0 → 0', () => {
    const inA = makePin('A', 'input', 1)
    const inB = makePin('B', 'input', 0)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('AND', [inA, inB, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })

  it('1,1 → 1', () => {
    const inA = makePin('A', 'input', 1)
    const inB = makePin('B', 'input', 1)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('AND', [inA, inB, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })
})

// ─── OR gate ────────────────────────────────────────────────────────────────

describe('propagateSignals – OR gate', () => {
  it('0,0 → 0', () => {
    const inA = makePin('A', 'input', 0)
    const inB = makePin('B', 'input', 0)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('OR', [inA, inB, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })

  it('1,0 → 1', () => {
    const inA = makePin('A', 'input', 1)
    const inB = makePin('B', 'input', 0)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('OR', [inA, inB, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })

  it('1,1 → 1', () => {
    const inA = makePin('A', 'input', 1)
    const inB = makePin('B', 'input', 1)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('OR', [inA, inB, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })
})

// ─── NOT gate ───────────────────────────────────────────────────────────────

describe('propagateSignals – NOT gate', () => {
  it('0 → 1', () => {
    const inA = makePin('A', 'input', 0)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('NOT', [inA, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })

  it('1 → 0', () => {
    const inA = makePin('A', 'input', 1)
    const out = makePin('Y', 'output', 0)
    const gate = makeComponent('NOT', [inA, out])
    const result = propagate(makeCircuit([gate]))
    expect(result.components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })
})

// ─── XOR gate ───────────────────────────────────────────────────────────────

describe('propagateSignals – XOR gate', () => {
  it('0,0 → 0', () => {
    const gate = makeComponent('XOR', [makePin('A', 'input', 0), makePin('B', 'input', 0), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })
  it('1,0 → 1', () => {
    const gate = makeComponent('XOR', [makePin('A', 'input', 1), makePin('B', 'input', 0), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })
  it('1,1 → 0', () => {
    const gate = makeComponent('XOR', [makePin('A', 'input', 1), makePin('B', 'input', 1), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })
})

// ─── NAND gate ──────────────────────────────────────────────────────────────

describe('propagateSignals – NAND gate', () => {
  it('0,0 → 1', () => {
    const gate = makeComponent('NAND', [makePin('A', 'input', 0), makePin('B', 'input', 0), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })
  it('1,0 → 1', () => {
    const gate = makeComponent('NAND', [makePin('A', 'input', 1), makePin('B', 'input', 0), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })
  it('1,1 → 0', () => {
    const gate = makeComponent('NAND', [makePin('A', 'input', 1), makePin('B', 'input', 1), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })
})

// ─── NOR gate ───────────────────────────────────────────────────────────────

describe('propagateSignals – NOR gate', () => {
  it('0,0 → 1', () => {
    const gate = makeComponent('NOR', [makePin('A', 'input', 0), makePin('B', 'input', 0), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })
  it('1,0 → 0', () => {
    const gate = makeComponent('NOR', [makePin('A', 'input', 1), makePin('B', 'input', 0), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })
  it('1,1 → 0', () => {
    const gate = makeComponent('NOR', [makePin('A', 'input', 1), makePin('B', 'input', 1), makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([gate])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })
})

// ─── VCC / GND ──────────────────────────────────────────────────────────────

describe('propagateSignals – VCC and GND', () => {
  it('VCC always outputs 1', () => {
    const vcc = makeComponent('VCC', [makePin('Y', 'output', 0)])
    expect(propagate(makeCircuit([vcc])).components[0].pins[0].signal).toBe(1)
  })

  it('GND has no outputs (input pin stays 0)', () => {
    const gnd = makeComponent('GND', [makePin('A', 'input', 0)])
    const result = propagate(makeCircuit([gnd]))
    expect(result.components[0].pins[0].signal).toBe(0)
  })
})

// ─── SWITCH ─────────────────────────────────────────────────────────────────

describe('propagateSignals – SWITCH', () => {
  it('outputs 0 when value=0', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 0 })
    expect(propagate(makeCircuit([sw])).components[0].pins[0].signal).toBe(0)
  })

  it('outputs 1 when value=1', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 1 })
    expect(propagate(makeCircuit([sw])).components[0].pins[0].signal).toBe(1)
  })
})

// ─── CLOCK ──────────────────────────────────────────────────────────────────

describe('propagateSignals – CLOCK', () => {
  it('outputs 0 when value=0', () => {
    const clk = makeComponent('CLOCK', [makePin('Y', 'output', 0)], { value: 0 })
    expect(propagate(makeCircuit([clk])).components[0].pins[0].signal).toBe(0)
  })

  it('outputs 1 when value=1', () => {
    const clk = makeComponent('CLOCK', [makePin('Y', 'output', 0)], { value: 1 })
    expect(propagate(makeCircuit([clk])).components[0].pins[0].signal).toBe(1)
  })
})

// ─── MUX ────────────────────────────────────────────────────────────────────

describe('propagateSignals – MUX 2:1', () => {
  function makeMux(i0: 0 | 1, i1: 0 | 1, s: 0 | 1) {
    const pins = [
      makePin('I0', 'input', i0),
      makePin('I1', 'input', i1),
      makePin('S', 'input', s),
      makePin('Y', 'output', 0),
    ]
    return makeComponent('MUX', pins)
  }

  it('S=0 selects I0', () => {
    const mux = makeMux(1, 0, 0)
    expect(propagate(makeCircuit([mux])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })

  it('S=1 selects I1', () => {
    const mux = makeMux(0, 1, 1)
    expect(propagate(makeCircuit([mux])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(1)
  })

  it('S=0, both inputs 0 → 0', () => {
    const mux = makeMux(0, 0, 0)
    expect(propagate(makeCircuit([mux])).components[0].pins.find(p => p.name === 'Y')!.signal).toBe(0)
  })
})

// ─── HALF_ADDER ─────────────────────────────────────────────────────────────

describe('propagateSignals – HALF_ADDER truth table', () => {
  function makeHA(a: 0 | 1, b: 0 | 1) {
    const pins = [
      makePin('A', 'input', a),
      makePin('B', 'input', b),
      makePin('Sum', 'output', 0),
      makePin('Carry', 'output', 0),
    ]
    return makeComponent('HALF_ADDER', pins)
  }

  const cases: [0 | 1, 0 | 1, 0 | 1, 0 | 1][] = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 0, 1],
  ]
  for (const [a, b, expectedSum, expectedCarry] of cases) {
    it(`A=${a} B=${b} → Sum=${expectedSum} Carry=${expectedCarry}`, () => {
      const ha = makeHA(a, b)
      const result = propagate(makeCircuit([ha]))
      const outPins = result.components[0].pins
      expect(outPins.find(p => p.name === 'Sum')!.signal).toBe(expectedSum)
      expect(outPins.find(p => p.name === 'Carry')!.signal).toBe(expectedCarry)
    })
  }
})

// ─── FULL_ADDER ─────────────────────────────────────────────────────────────

describe('propagateSignals – FULL_ADDER truth table', () => {
  function makeFA(a: 0 | 1, b: 0 | 1, cin: 0 | 1) {
    const pins = [
      makePin('A', 'input', a),
      makePin('B', 'input', b),
      makePin('Cin', 'input', cin),
      makePin('Sum', 'output', 0),
      makePin('Cout', 'output', 0),
    ]
    return makeComponent('FULL_ADDER', pins)
  }

  const cases: [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ]
  for (const [a, b, cin, expectedSum, expectedCout] of cases) {
    it(`A=${a} B=${b} Cin=${cin} → Sum=${expectedSum} Cout=${expectedCout}`, () => {
      const fa = makeFA(a, b, cin)
      const result = propagate(makeCircuit([fa]))
      const outPins = result.components[0].pins
      expect(outPins.find(p => p.name === 'Sum')!.signal).toBe(expectedSum)
      expect(outPins.find(p => p.name === 'Cout')!.signal).toBe(expectedCout)
    })
  }
})

// ─── D_FLIP_FLOP ─────────────────────────────────────────────────────────────

describe('propagateSignals – D_FLIP_FLOP', () => {
  function makeDFF(d: 0 | 1, clk: 0 | 1, prevClk: number, q: number) {
    const pins = [
      makePin('D', 'input', d),
      makePin('CLK', 'input', clk),
      makePin('Q', 'output', 0),
      makePin('QB', 'output', 0),
    ]
    return makeComponent('D_FLIP_FLOP', pins, { q, prevClk })
  }

  it('rising edge: captures D=1', () => {
    const dff = makeDFF(1, 1, 0, 0)
    const result = propagate(makeCircuit([dff]))
    const pins = result.components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(1)
    expect(pins.find(p => p.name === 'QB')!.signal).toBe(0)
  })

  it('rising edge: captures D=0', () => {
    const dff = makeDFF(0, 1, 0, 1)
    const result = propagate(makeCircuit([dff]))
    const pins = result.components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(0)
    expect(pins.find(p => p.name === 'QB')!.signal).toBe(1)
  })

  it('no rising edge (CLK stays 1): holds state', () => {
    const dff = makeDFF(0, 1, 1, 1) // prevClk=1 currClk=1, no edge
    const result = propagate(makeCircuit([dff]))
    const pins = result.components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(1)
  })

  it('no rising edge (CLK=0): holds state', () => {
    const dff = makeDFF(1, 0, 0, 1) // clk=0, no rising edge
    const result = propagate(makeCircuit([dff]))
    const pins = result.components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(1)
  })

  it('Q and QB are always complementary', () => {
    for (const d of [0, 1] as (0 | 1)[]) {
      const dff = makeDFF(d, 1, 0, 0)
      const result = propagate(makeCircuit([dff]))
      const pins = result.components[0].pins
      const q = pins.find(p => p.name === 'Q')!.signal
      const qb = pins.find(p => p.name === 'QB')!.signal
      expect(q + qb).toBe(1)
    }
  })
})

// ─── JK_FLIP_FLOP ─────────────────────────────────────────────────────────────

describe('propagateSignals – JK_FLIP_FLOP', () => {
  function makeJKFF(j: 0 | 1, k: 0 | 1, clk: 0 | 1, prevClk: number, q: number) {
    const pins = [
      makePin('J', 'input', j),
      makePin('K', 'input', k),
      makePin('CLK', 'input', clk),
      makePin('Q', 'output', 0),
      makePin('QB', 'output', 0),
    ]
    return makeComponent('JK_FLIP_FLOP', pins, { q, prevClk })
  }

  it('J=0 K=0: hold (Q stays 0)', () => {
    const ff = makeJKFF(0, 0, 1, 0, 0)
    const pins = propagate(makeCircuit([ff])).components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(0)
  })

  it('J=0 K=0: hold (Q stays 1)', () => {
    const ff = makeJKFF(0, 0, 1, 0, 1)
    const pins = propagate(makeCircuit([ff])).components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(1)
  })

  it('J=0 K=1: reset (Q=0)', () => {
    const ff = makeJKFF(0, 1, 1, 0, 1)
    const pins = propagate(makeCircuit([ff])).components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(0)
  })

  it('J=1 K=0: set (Q=1)', () => {
    const ff = makeJKFF(1, 0, 1, 0, 0)
    const pins = propagate(makeCircuit([ff])).components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(1)
  })

  it('J=1 K=1: toggle (Q was 0 → 1)', () => {
    const ff = makeJKFF(1, 1, 1, 0, 0)
    const pins = propagate(makeCircuit([ff])).components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(1)
  })

  it('J=1 K=1: toggle (Q was 1 → 0)', () => {
    const ff = makeJKFF(1, 1, 1, 0, 1)
    const pins = propagate(makeCircuit([ff])).components[0].pins
    expect(pins.find(p => p.name === 'Q')!.signal).toBe(0)
  })

  it('Q and QB are always complementary', () => {
    for (const [j, k] of [[0, 0], [0, 1], [1, 0], [1, 1]] as [0 | 1, 0 | 1][]) {
      const ff = makeJKFF(j, k, 1, 0, 0)
      const pins = propagate(makeCircuit([ff])).components[0].pins
      const q = pins.find(p => p.name === 'Q')!.signal
      const qb = pins.find(p => p.name === 'QB')!.signal
      expect(q + qb, `J=${j} K=${k}`).toBe(1)
    }
  })
})

// ─── wire signal propagation ────────────────────────────────────────────────

describe('propagateSignals – wire signal propagation', () => {
  it('propagates output signal through a wire to the downstream input', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 1 })
    const led = makeComponent('LED', [makePin('A', 'input', 0)])
    const wire = makeWire(sw, sw.pins[0], led, led.pins[0])
    const result = propagate(makeCircuit([sw, led], [wire]))
    expect(result.components[1].pins[0].signal).toBe(1)
    expect(result.wires[0].signal).toBe(1)
  })

  it('chained propagation: SWITCH → AND → LED', () => {
    const swA = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 1 })
    const swB = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 1 })
    const andPins = [makePin('A', 'input', 0), makePin('B', 'input', 0), makePin('Y', 'output', 0)]
    const and = makeComponent('AND', andPins)
    const led = makeComponent('LED', [makePin('A', 'input', 0)])

    const wires = [
      makeWire(swA, swA.pins[0], and, andPins[0]),
      makeWire(swB, swB.pins[0], and, andPins[1]),
      makeWire(and, andPins[2], led, led.pins[0]),
    ]

    const result = propagate(makeCircuit([swA, swB, and, led], wires))
    expect(result.components[3].pins[0].signal).toBe(1)
  })
})

// ─── useSimulation hook actions ──────────────────────────────────────────────

describe('useSimulation – toggleSwitch', () => {
  it('toggles switch state from 0 to 1', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 0 })
    const circuit = makeCircuit([sw])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.toggleSwitch(sw.id) })

    const updatedSw = result.current.circuit.components.find(c => c.id === sw.id)!
    expect(updatedSw.state.value).toBe(1)
  })

  it('toggles switch state from 1 back to 0', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 1 })
    const circuit = makeCircuit([sw])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.toggleSwitch(sw.id) })

    const updatedSw = result.current.circuit.components.find(c => c.id === sw.id)!
    expect(updatedSw.state.value).toBe(0)
  })

  it('does not toggle non-switch components', () => {
    const led = makeComponent('LED', [makePin('A', 'input', 0)])
    const circuit = makeCircuit([led])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.toggleSwitch(led.id) })

    // LED state unchanged (still empty)
    expect(Object.keys(result.current.circuit.components[0].state)).toHaveLength(0)
  })
})

describe('useSimulation – addComponent', () => {
  it('adds a new component to the circuit', () => {
    const circuit = makeCircuit([])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.addComponent('AND', 50, 100) })

    expect(result.current.circuit.components).toHaveLength(1)
    expect(result.current.circuit.components[0].type).toBe('AND')
    expect(result.current.circuit.components[0].x).toBe(50)
    expect(result.current.circuit.components[0].y).toBe(100)
  })
})

describe('useSimulation – removeComponent', () => {
  it('removes the component and its connected wires', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 0 })
    const led = makeComponent('LED', [makePin('A', 'input', 0)])
    const wire = makeWire(sw, sw.pins[0], led, led.pins[0])
    const circuit = makeCircuit([sw, led], [wire])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.removeComponent(sw.id) })

    expect(result.current.circuit.components.find(c => c.id === sw.id)).toBeUndefined()
    expect(result.current.circuit.wires.find(w => w.id === wire.id)).toBeUndefined()
  })
})

describe('useSimulation – addWire / removeWire', () => {
  it('addWire adds a wire to the circuit', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 0 })
    const led = makeComponent('LED', [makePin('A', 'input', 0)])
    const circuit = makeCircuit([sw, led], [])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => {
      result.current.addWire({
        fromComponentId: sw.id,
        fromPinId: sw.pins[0].id,
        toComponentId: led.id,
        toPinId: led.pins[0].id,
        path: [],
      })
    })

    expect(result.current.circuit.wires).toHaveLength(1)
  })

  it('removeWire removes the correct wire', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 0 })
    const led = makeComponent('LED', [makePin('A', 'input', 0)])
    const wire = makeWire(sw, sw.pins[0], led, led.pins[0])
    const circuit = makeCircuit([sw, led], [wire])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.removeWire(wire.id) })

    expect(result.current.circuit.wires).toHaveLength(0)
  })
})

describe('useSimulation – moveComponent', () => {
  it('updates component coordinates', () => {
    const sw = makeComponent('SWITCH', [makePin('Y', 'output', 0)], { value: 0 })
    const circuit = makeCircuit([sw])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.moveComponent(sw.id, 300, 400) })

    const moved = result.current.circuit.components.find(c => c.id === sw.id)!
    expect(moved.x).toBe(300)
    expect(moved.y).toBe(400)
  })
})

describe('useSimulation – undo', () => {
  it('reverts the last change', () => {
    const circuit = makeCircuit([])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.addComponent('AND', 10, 10) })
    expect(result.current.circuit.components).toHaveLength(1)

    act(() => { result.current.undo() })
    expect(result.current.circuit.components).toHaveLength(0)
  })
})

describe('useSimulation – stepSimulation', () => {
  it('toggles CLOCK component value on each step', () => {
    const clk = makeComponent('CLOCK', [makePin('Y', 'output', 0)], { value: 0 })
    const circuit = makeCircuit([clk])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.stepSimulation() })
    expect(result.current.circuit.components[0].state.value).toBe(1)

    act(() => { result.current.stepSimulation() })
    expect(result.current.circuit.components[0].state.value).toBe(0)
  })
})

describe('useSimulation – startSimulation / stopSimulation', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('isRunning is false by default', () => {
    const { result } = renderHook(() => useSimulation(makeCircuit([])))
    expect(result.current.isRunning).toBe(false)
  })

  it('isRunning becomes true after startSimulation', () => {
    const { result } = renderHook(() => useSimulation(makeCircuit([])))
    act(() => { result.current.startSimulation() })
    expect(result.current.isRunning).toBe(true)
  })

  it('isRunning becomes false after stopSimulation', () => {
    const { result } = renderHook(() => useSimulation(makeCircuit([])))
    act(() => { result.current.startSimulation() })
    act(() => { result.current.stopSimulation() })
    expect(result.current.isRunning).toBe(false)
  })

  it('CLOCK toggles when simulation runs', () => {
    const clk = makeComponent('CLOCK', [makePin('Y', 'output', 0)], { value: 0 })
    const circuit = makeCircuit([clk])
    const { result } = renderHook(() => useSimulation(circuit))

    act(() => { result.current.startSimulation() })
    act(() => { vi.advanceTimersByTime(1100) }) // 1 tick at default speed=1

    expect(result.current.circuit.components[0].state.value).toBe(1)
    act(() => { result.current.stopSimulation() })
  })
})
