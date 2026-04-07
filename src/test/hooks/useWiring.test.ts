import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWiring, WirePinRef } from '../../hooks/useWiring'

function makePin(componentId: string, pinId: string, pinType: 'input' | 'output', x = 0, y = 0): WirePinRef {
  return { componentId, pinId, pinType, worldX: x, worldY: y }
}

describe('useWiring – initial state', () => {
  it('starts inactive with no start pin', () => {
    const { result } = renderHook(() => useWiring())
    expect(result.current.wiringState.active).toBe(false)
    expect(result.current.wiringState.startPin).toBeNull()
    expect(result.current.wiringState.mouseX).toBe(0)
    expect(result.current.wiringState.mouseY).toBe(0)
  })
})

describe('useWiring – beginWire', () => {
  it('sets active and records the start pin', () => {
    const { result } = renderHook(() => useWiring())
    const pin = makePin('comp1', 'pin1', 'output', 50, 100)

    act(() => { result.current.beginWire(pin) })

    expect(result.current.wiringState.active).toBe(true)
    expect(result.current.wiringState.startPin).toEqual(pin)
    expect(result.current.wiringState.mouseX).toBe(50)
    expect(result.current.wiringState.mouseY).toBe(100)
  })
})

describe('useWiring – updateMousePos', () => {
  it('updates mouse coordinates when wiring is active', () => {
    const { result } = renderHook(() => useWiring())

    act(() => { result.current.beginWire(makePin('c1', 'p1', 'output', 0, 0)) })
    act(() => { result.current.updateMousePos(200, 300) })

    expect(result.current.wiringState.mouseX).toBe(200)
    expect(result.current.wiringState.mouseY).toBe(300)
  })

  it('does not update mouse when wiring is inactive', () => {
    const { result } = renderHook(() => useWiring())

    act(() => { result.current.updateMousePos(200, 300) })

    expect(result.current.wiringState.mouseX).toBe(0)
    expect(result.current.wiringState.mouseY).toBe(0)
  })
})

describe('useWiring – cancelWire', () => {
  it('resets state to inactive', () => {
    const { result } = renderHook(() => useWiring())

    act(() => { result.current.beginWire(makePin('c1', 'p1', 'output', 10, 20)) })
    act(() => { result.current.cancelWire() })

    expect(result.current.wiringState.active).toBe(false)
    expect(result.current.wiringState.startPin).toBeNull()
    expect(result.current.wiringState.mouseX).toBe(0)
    expect(result.current.wiringState.mouseY).toBe(0)
  })
})

describe('useWiring – endWire', () => {
  it('adds a wire when connecting output → input on different components', () => {
    const { result } = renderHook(() => useWiring())
    const startPin = makePin('compA', 'pinOut', 'output', 0, 50)
    const endPin = makePin('compB', 'pinIn', 'input', 100, 50)

    act(() => { result.current.beginWire(startPin) })

    const addWire = vi.fn()
    let success = false
    act(() => { success = result.current.endWire(endPin, addWire) })

    expect(success).toBe(true)
    expect(addWire).toHaveBeenCalledOnce()
    const arg = addWire.mock.calls[0][0]
    expect(arg.fromComponentId).toBe('compA')
    expect(arg.fromPinId).toBe('pinOut')
    expect(arg.toComponentId).toBe('compB')
    expect(arg.toPinId).toBe('pinIn')
    expect(result.current.wiringState.active).toBe(false)
  })

  it('also connects when start is input and end is output (auto-reversal)', () => {
    const { result } = renderHook(() => useWiring())
    const startPin = makePin('compB', 'pinIn', 'input', 100, 50)
    const endPin = makePin('compA', 'pinOut', 'output', 0, 50)

    act(() => { result.current.beginWire(startPin) })

    const addWire = vi.fn()
    let success = false
    act(() => { success = result.current.endWire(endPin, addWire) })

    expect(success).toBe(true)
    expect(addWire).toHaveBeenCalledOnce()
    const arg = addWire.mock.calls[0][0]
    expect(arg.fromComponentId).toBe('compA')
    expect(arg.toComponentId).toBe('compB')
  })

  it('rejects connecting a component to itself', () => {
    const { result } = renderHook(() => useWiring())
    const startPin = makePin('sameComp', 'pinOut', 'output', 0, 0)
    const endPin = makePin('sameComp', 'pinIn', 'input', 100, 0)

    act(() => { result.current.beginWire(startPin) })

    const addWire = vi.fn()
    let success = true
    act(() => { success = result.current.endWire(endPin, addWire) })

    expect(success).toBe(false)
    expect(addWire).not.toHaveBeenCalled()
  })

  it('rejects output → output connections', () => {
    const { result } = renderHook(() => useWiring())
    const startPin = makePin('compA', 'pinOut', 'output', 0, 0)
    const endPin = makePin('compB', 'pinOut2', 'output', 100, 0)

    act(() => { result.current.beginWire(startPin) })

    const addWire = vi.fn()
    let success = true
    act(() => { success = result.current.endWire(endPin, addWire) })

    expect(success).toBe(false)
    expect(addWire).not.toHaveBeenCalled()
  })

  it('rejects input → input connections', () => {
    const { result } = renderHook(() => useWiring())
    const startPin = makePin('compA', 'pinIn', 'input', 0, 0)
    const endPin = makePin('compB', 'pinIn2', 'input', 100, 0)

    act(() => { result.current.beginWire(startPin) })

    const addWire = vi.fn()
    let success = true
    act(() => { success = result.current.endWire(endPin, addWire) })

    expect(success).toBe(false)
    expect(addWire).not.toHaveBeenCalled()
  })

  it('returns false when there is no active start pin', () => {
    const { result } = renderHook(() => useWiring())
    const endPin = makePin('compB', 'pinIn', 'input', 100, 0)
    const addWire = vi.fn()
    let success = true
    act(() => { success = result.current.endWire(endPin, addWire) })
    expect(success).toBe(false)
    expect(addWire).not.toHaveBeenCalled()
  })
})

describe('useWiring – computePath (orthogonal routing)', () => {
  it('returns a 4-point L-shaped path', () => {
    const { result } = renderHook(() => useWiring())
    const path = result.current.computePath(0, 0, 100, 100)
    expect(path).toHaveLength(4)
    expect(path[0]).toEqual({ x: 0, y: 0 })
    expect(path[3]).toEqual({ x: 100, y: 100 })
  })

  it('midpoint is halfway in X', () => {
    const { result } = renderHook(() => useWiring())
    const path = result.current.computePath(0, 0, 200, 100)
    // midX = 100
    expect(path[1].x).toBe(100)
    expect(path[1].y).toBe(0)
    expect(path[2].x).toBe(100)
    expect(path[2].y).toBe(100)
  })

  it('handles same start and end coordinates', () => {
    const { result } = renderHook(() => useWiring())
    const path = result.current.computePath(50, 75, 50, 75)
    expect(path).toHaveLength(4)
    expect(path[0]).toEqual({ x: 50, y: 75 })
    expect(path[3]).toEqual({ x: 50, y: 75 })
  })

  it('endWire uses orthogonal path', () => {
    const { result } = renderHook(() => useWiring())
    const startPin = makePin('compA', 'pinOut', 'output', 0, 50)
    const endPin = makePin('compB', 'pinIn', 'input', 200, 50)

    act(() => { result.current.beginWire(startPin) })
    const addWire = vi.fn()
    act(() => { result.current.endWire(endPin, addWire) })

    const path = addWire.mock.calls[0][0].path
    expect(path).toHaveLength(4)
    expect(path[0]).toEqual({ x: 0, y: 50 })
    expect(path[3]).toEqual({ x: 200, y: 50 })
  })
})
