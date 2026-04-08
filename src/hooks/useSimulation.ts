import { useState, useCallback, useRef, useEffect } from 'react'
import { Circuit, CircuitComponent, Wire } from '../types/circuit'
import { createComponent } from '../data/components'
import { ComponentType } from '../types/circuit'

function propagateSignals(circ: Circuit): Circuit {
  const components = circ.components.map(c => ({
    ...c,
    pins: c.pins.map(p => ({ ...p })),
    state: { ...c.state },
  }))
  const wires = circ.wires.map(w => ({ ...w }))

  for (let pass = 0; pass < 10; pass++) {
    for (const comp of components) {
      const inputPins = comp.pins.filter(p => p.type === 'input')
      const outputPins = comp.pins.filter(p => p.type === 'output')

      switch (comp.type) {
        case 'AND':
          if (outputPins[0]) outputPins[0].signal = (inputPins.every(p => p.signal === 1) ? 1 : 0) as 0 | 1
          break
        case 'OR':
          if (outputPins[0]) outputPins[0].signal = (inputPins.some(p => p.signal === 1) ? 1 : 0) as 0 | 1
          break
        case 'NOT':
          if (outputPins[0]) outputPins[0].signal = (inputPins[0]?.signal === 1 ? 0 : 1) as 0 | 1
          break
        case 'XOR':
          if (outputPins[0]) outputPins[0].signal = (inputPins.filter(p => p.signal === 1).length % 2 === 1 ? 1 : 0) as 0 | 1
          break
        case 'NAND':
          if (outputPins[0]) outputPins[0].signal = (inputPins.every(p => p.signal === 1) ? 0 : 1) as 0 | 1
          break
        case 'NOR':
          if (outputPins[0]) outputPins[0].signal = (inputPins.some(p => p.signal === 1) ? 0 : 1) as 0 | 1
          break
        case 'VCC':
          if (outputPins[0]) outputPins[0].signal = 1
          break
        case 'GND':
          if (outputPins[0]) outputPins[0].signal = 0
          break
        case 'SWITCH':
          if (outputPins[0]) outputPins[0].signal = ((comp.state.value ?? 0) as number) === 1 ? 1 : 0
          break
        case 'CLOCK':
          if (outputPins[0]) outputPins[0].signal = ((comp.state.value ?? 0) as number) === 1 ? 1 : 0
          break
        case 'MUX': {
          const sPin = comp.pins.find(p => p.name === 'S')
          const i0Pin = comp.pins.find(p => p.name === 'I0')
          const i1Pin = comp.pins.find(p => p.name === 'I1')
          if (outputPins[0] && sPin && i0Pin && i1Pin) {
            outputPins[0].signal = sPin.signal === 0 ? i0Pin.signal : i1Pin.signal
          }
          break
        }
        case 'D_FLIP_FLOP': {
          const dPin = comp.pins.find(p => p.name === 'D')
          const clkPin = comp.pins.find(p => p.name === 'CLK')
          const prevClk = (comp.state.prevClk ?? 0) as number
          const currClk = clkPin?.signal ?? 0
          // Rising edge: clock went from 0 to 1
          if (prevClk === 0 && currClk === 1 && dPin !== undefined) {
            comp.state.q = dPin.signal
          }
          comp.state.prevClk = currClk
          if (outputPins[0]) outputPins[0].signal = ((comp.state.q ?? 0) as number) === 1 ? 1 : 0
          if (outputPins[1]) outputPins[1].signal = ((comp.state.q ?? 0) as number) === 1 ? 0 : 1
          break
        }
        case 'JK_FLIP_FLOP': {
          const jPin = comp.pins.find(p => p.name === 'J')
          const kPin = comp.pins.find(p => p.name === 'K')
          const clkPin = comp.pins.find(p => p.name === 'CLK')
          const prevClk = (comp.state.prevClk ?? 0) as number
          const currClk = clkPin?.signal ?? 0
          // Rising edge
          if (prevClk === 0 && currClk === 1 && jPin !== undefined && kPin !== undefined) {
            const j = jPin.signal, k = kPin.signal
            const q = (comp.state.q ?? 0) as number
            if (j === 0 && k === 0) { /* hold */ }
            else if (j === 0 && k === 1) comp.state.q = 0
            else if (j === 1 && k === 0) comp.state.q = 1
            else comp.state.q = q === 1 ? 0 : 1 // toggle
          }
          comp.state.prevClk = currClk
          if (outputPins[0]) outputPins[0].signal = ((comp.state.q ?? 0) as number) === 1 ? 1 : 0
          if (outputPins[1]) outputPins[1].signal = ((comp.state.q ?? 0) as number) === 1 ? 0 : 1
          break
        }
        case 'XNOR':
          if (outputPins[0]) outputPins[0].signal = (inputPins.filter(p => p.signal === 1).length % 2 === 0 ? 1 : 0) as 0 | 1
          break
        case 'BUFFER':
          if (outputPins[0]) outputPins[0].signal = (inputPins[0]?.signal ?? 0) as 0 | 1
          break
        case 'AND3':
          if (outputPins[0]) outputPins[0].signal = (inputPins.every(p => p.signal === 1) ? 1 : 0) as 0 | 1
          break
        case 'OR3':
          if (outputPins[0]) outputPins[0].signal = (inputPins.some(p => p.signal === 1) ? 1 : 0) as 0 | 1
          break
        case 'NAND3':
          if (outputPins[0]) outputPins[0].signal = (inputPins.every(p => p.signal === 1) ? 0 : 1) as 0 | 1
          break
        case 'NOR3':
          if (outputPins[0]) outputPins[0].signal = (inputPins.some(p => p.signal === 1) ? 0 : 1) as 0 | 1
          break
        case 'XOR3':
          if (outputPins[0]) outputPins[0].signal = (inputPins.filter(p => p.signal === 1).length % 2 === 1 ? 1 : 0) as 0 | 1
          break
        case 'T_FLIP_FLOP': {
          const tPin = comp.pins.find(p => p.name === 'T')
          const clkPin = comp.pins.find(p => p.name === 'CLK')
          const prevClk = (comp.state.prevClk ?? 0) as number
          const currClk = clkPin?.signal ?? 0
          if (prevClk === 0 && currClk === 1 && tPin !== undefined) {
            if (tPin.signal === 1) comp.state.q = comp.state.q === 1 ? 0 : 1
          }
          comp.state.prevClk = currClk
          if (outputPins[0]) outputPins[0].signal = ((comp.state.q ?? 0) as number) === 1 ? 1 : 0
          if (outputPins[1]) outputPins[1].signal = ((comp.state.q ?? 0) as number) === 1 ? 0 : 1
          break
        }
        case 'SR_LATCH': {
          const sPin = comp.pins.find(p => p.name === 'S')
          const rPin = comp.pins.find(p => p.name === 'R')
          if (sPin && rPin) {
            if (sPin.signal === 1 && rPin.signal === 1) comp.state.q = 1 // invalid → Q=1 by convention
            else if (sPin.signal === 1) comp.state.q = 1
            else if (rPin.signal === 1) comp.state.q = 0
            // else hold
          }
          if (outputPins[0]) outputPins[0].signal = ((comp.state.q ?? 0) as number) === 1 ? 1 : 0
          if (outputPins[1]) outputPins[1].signal = ((comp.state.q ?? 0) as number) === 1 ? 0 : 1
          break
        }
        case 'DECODER_2_4': {
          const aPin = comp.pins.find(p => p.name === 'A')
          const bPin = comp.pins.find(p => p.name === 'B')
          const y0 = comp.pins.find(p => p.name === 'Y0')
          const y1 = comp.pins.find(p => p.name === 'Y1')
          const y2 = comp.pins.find(p => p.name === 'Y2')
          const y3 = comp.pins.find(p => p.name === 'Y3')
          if (aPin && bPin) {
            const idx = aPin.signal + bPin.signal * 2
            if (y0) y0.signal = idx === 0 ? 1 : 0
            if (y1) y1.signal = idx === 1 ? 1 : 0
            if (y2) y2.signal = idx === 2 ? 1 : 0
            if (y3) y3.signal = idx === 3 ? 1 : 0
          }
          break
        }
        case 'DEMUX': {
          const iPin = comp.pins.find(p => p.name === 'I')
          const sPin = comp.pins.find(p => p.name === 'S')
          const y0 = comp.pins.find(p => p.name === 'Y0')
          const y1 = comp.pins.find(p => p.name === 'Y1')
          if (iPin && sPin) {
            if (y0) y0.signal = sPin.signal === 0 ? iPin.signal : 0
            if (y1) y1.signal = sPin.signal === 1 ? iPin.signal : 0
          }
          break
        }
        case 'HALF_ADDER': {
          const aPin = comp.pins.find(p => p.name === 'A')
          const bPin = comp.pins.find(p => p.name === 'B')
          const sumPin = comp.pins.find(p => p.name === 'Sum')
          const carryPin = comp.pins.find(p => p.name === 'Carry')
          if (aPin && bPin) {
            const a = aPin.signal, b = bPin.signal
            if (sumPin) sumPin.signal = ((a ^ b) as 0 | 1)
            if (carryPin) carryPin.signal = ((a & b) as 0 | 1)
          }
          break
        }
        case 'FULL_ADDER': {
          const aPin = comp.pins.find(p => p.name === 'A')
          const bPin = comp.pins.find(p => p.name === 'B')
          const cinPin = comp.pins.find(p => p.name === 'Cin')
          const sumPin = comp.pins.find(p => p.name === 'Sum')
          const coutPin = comp.pins.find(p => p.name === 'Cout')
          if (aPin && bPin && cinPin) {
            const sum = aPin.signal + bPin.signal + cinPin.signal
            if (sumPin) sumPin.signal = (sum % 2) as 0 | 1
            if (coutPin) coutPin.signal = (sum >= 2 ? 1 : 0) as 0 | 1
          }
          break
        }
        default:
          break
      }
    }

    for (const wire of wires) {
      const fromComp = components.find(c => c.id === wire.fromComponentId)
      const toComp = components.find(c => c.id === wire.toComponentId)
      if (fromComp && toComp) {
        const fromPin = fromComp.pins.find(p => p.id === wire.fromPinId)
        const toPin = toComp.pins.find(p => p.id === wire.toPinId)
        if (fromPin && toPin) {
          wire.signal = fromPin.signal
          toPin.signal = fromPin.signal
        }
      }
    }
  }

  return { ...circ, components, wires }
}

let _idCounter = 100

export function useSimulation(initialCircuit: Circuit) {
  const [circuit, setCircuit] = useState<Circuit>(() => propagateSignals(initialCircuit))
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const historyRef = useRef<Circuit[]>([])

  const applyAndPropagate = useCallback((updater: (c: Circuit) => Circuit) => {
    setCircuit(prev => {
      historyRef.current = [...historyRef.current.slice(-20), prev]
      const next = updater(prev)
      return propagateSignals(next)
    })
  }, [])

  const toggleSwitch = useCallback((componentId: string) => {
    applyAndPropagate(circ => ({
      ...circ,
      components: circ.components.map(c =>
        c.id === componentId && c.type === 'SWITCH'
          ? { ...c, state: { ...c.state, value: c.state.value === 1 ? 0 : 1 } }
          : c
      ),
    }))
  }, [applyAndPropagate])

  const addComponent = useCallback((type: ComponentType, x: number, y: number) => {
    const comp = createComponent(type, x, y)
    applyAndPropagate(circ => ({
      ...circ,
      components: [...circ.components, comp],
    }))
    return comp
  }, [applyAndPropagate])

  const removeComponent = useCallback((componentId: string) => {
    applyAndPropagate(circ => ({
      ...circ,
      components: circ.components.filter(c => c.id !== componentId),
      wires: circ.wires.filter(w => w.fromComponentId !== componentId && w.toComponentId !== componentId),
    }))
  }, [applyAndPropagate])

  const addWire = useCallback((wire: Omit<Wire, 'id' | 'signal'>) => {
    const newWire: Wire = {
      ...wire,
      id: `wire-${Date.now()}-${_idCounter++}`,
      signal: 0,
    }
    applyAndPropagate(circ => ({
      ...circ,
      wires: [...circ.wires, newWire],
    }))
  }, [applyAndPropagate])

  const removeWire = useCallback((wireId: string) => {
    applyAndPropagate(circ => ({
      ...circ,
      wires: circ.wires.filter(w => w.id !== wireId),
    }))
  }, [applyAndPropagate])

  const moveComponent = useCallback((componentId: string, x: number, y: number) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(c =>
        c.id === componentId ? { ...c, x, y } : c
      ),
    }))
  }, [])

  const startSimulation = useCallback(() => setIsRunning(true), [])
  const stopSimulation = useCallback(() => setIsRunning(false), [])

  const stepSimulation = useCallback(() => {
    setCircuit(prev => {
      const updated = {
        ...prev,
        components: prev.components.map(c => {
          if (c.type === 'CLOCK') {
            return { ...c, state: { ...c.state, value: c.state.value === 1 ? 0 : 1 } }
          }
          return c
        }),
      }
      return propagateSignals(updated)
    })
  }, [])

  const undo = useCallback(() => {
    const prev = historyRef.current.pop()
    if (prev) setCircuit(prev)
  }, [])

  const propagate = useCallback((circ: Circuit) => propagateSignals(circ), [])

  useEffect(() => {
    if (isRunning) {
      clockRef.current = setInterval(() => {
        setCircuit(circ => {
          const updated = {
            ...circ,
            components: circ.components.map(c => {
              if (c.type === 'CLOCK') {
                const clkVal = c.state.value === 1 ? 0 : 1
                return { ...c, state: { ...c.state, value: clkVal } }
              }
              return c
            }),
          }
          return propagateSignals(updated)
        })
      }, 1000 / speed)
    } else {
      if (clockRef.current) {
        clearInterval(clockRef.current)
        clockRef.current = null
      }
    }
    return () => {
      if (clockRef.current) {
        clearInterval(clockRef.current)
        clockRef.current = null
      }
    }
  }, [isRunning, speed])

  return {
    circuit,
    setCircuit,
    isRunning,
    speed,
    setSpeed,
    toggleSwitch,
    addComponent,
    removeComponent,
    addWire,
    removeWire,
    moveComponent,
    startSimulation,
    stopSimulation,
    stepSimulation,
    undo,
    propagate,
  }
}
