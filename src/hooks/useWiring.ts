import { useState, useCallback } from 'react'

export interface WirePinRef {
  componentId: string
  pinId: string
  pinType: 'input' | 'output'
  worldX: number
  worldY: number
}

export interface WiringState {
  active: boolean
  startPin: WirePinRef | null
  mouseX: number
  mouseY: number
}

function computeOrthogonalPath(
  sx: number, sy: number,
  ex: number, ey: number,
): { x: number; y: number }[] {
  const midX = (sx + ex) / 2
  return [
    { x: sx, y: sy },
    { x: midX, y: sy },
    { x: midX, y: ey },
    { x: ex, y: ey },
  ]
}

export function useWiring() {
  const [wiringState, setWiringState] = useState<WiringState>({
    active: false,
    startPin: null,
    mouseX: 0,
    mouseY: 0,
  })

  const beginWire = useCallback((pin: WirePinRef) => {
    setWiringState({ active: true, startPin: pin, mouseX: pin.worldX, mouseY: pin.worldY })
  }, [])

  const updateMousePos = useCallback((x: number, y: number) => {
    setWiringState(prev => prev.active ? { ...prev, mouseX: x, mouseY: y } : prev)
  }, [])

  const cancelWire = useCallback(() => {
    setWiringState({ active: false, startPin: null, mouseX: 0, mouseY: 0 })
  }, [])

  const endWire = useCallback((
    endPin: WirePinRef,
    onAddWire: (wire: {
      fromComponentId: string
      fromPinId: string
      toComponentId: string
      toPinId: string
      path: { x: number; y: number }[]
    }) => void,
    startOverride?: WirePinRef,
  ) => {
    const start = startOverride ?? wiringState.startPin
    if (!start) return false

    const from = start.pinType === 'output' ? start : endPin
    const to = start.pinType === 'output' ? endPin : start

    if (from.pinType !== 'output' || to.pinType !== 'input') {
      return false
    }
    if (from.componentId === to.componentId) return false

    const path = computeOrthogonalPath(from.worldX, from.worldY, to.worldX, to.worldY)
    onAddWire({
      fromComponentId: from.componentId,
      fromPinId: from.pinId,
      toComponentId: to.componentId,
      toPinId: to.pinId,
      path,
    })
    setWiringState({ active: false, startPin: null, mouseX: 0, mouseY: 0 })
    return true
  }, [wiringState.startPin])

  const computePath = useCallback((
    sx: number, sy: number, ex: number, ey: number,
  ) => computeOrthogonalPath(sx, sy, ex, ey), [])

  return { wiringState, beginWire, endWire, cancelWire, updateMousePos, computePath }
}
