import { useRef, useCallback, useState } from 'react'
import { Circuit, CircuitComponent, Pin, ComponentType } from '../../types/circuit'
import { Viewport } from '../../hooks/useCanvas'
import { WiringState, WirePinRef } from '../../hooks/useWiring'
import SimComponent from './SimComponent'
import WireLayer from './WireLayer'
import { createComponent, COMPONENT_TEMPLATES } from '../../data/components'

interface SimulatorCanvasProps {
  circuit: Circuit
  viewport: Viewport
  canvasRef: React.RefObject<HTMLDivElement>
  wiringState: WiringState
  placingComponent: ComponentType | null
  selectedId: string | null
  onSelectComponent: (id: string | null) => void
  onPinClick: (component: CircuitComponent, pin: Pin, e: React.MouseEvent) => void
  onToggleSwitch: (id: string) => void
  onPlaceComponent: (type: ComponentType, x: number, y: number) => void
  onMoveComponent: (id: string, x: number, y: number) => void
  onWireClick: (wireId: string) => void
  screenToWorld: (sx: number, sy: number, vp: Viewport) => { x: number; y: number }
}

function snap(v: number, grid = 20) {
  return Math.round(v / grid) * grid
}

export default function SimulatorCanvas({
  circuit,
  viewport,
  canvasRef,
  wiringState,
  placingComponent,
  selectedId,
  onSelectComponent,
  onPinClick,
  onToggleSwitch,
  onPlaceComponent,
  onMoveComponent,
  onWireClick,
  screenToWorld,
}: SimulatorCanvasProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const draggingComp = useRef<{ id: string; startX: number; startY: number; startMouseX: number; startMouseY: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport)
    setMousePos({ x: world.x, y: world.y })

    if (draggingComp.current) {
      const { id, startX, startY, startMouseX, startMouseY } = draggingComp.current
      const dx = (e.clientX - startMouseX) / viewport.zoom
      const dy = (e.clientY - startMouseY) / viewport.zoom
      onMoveComponent(id, snap(startX + dx), snap(startY + dy))
    }
  }, [screenToWorld, viewport, onMoveComponent])

  const handleMouseUp = useCallback(() => {
    draggingComp.current = null
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains('canvas-bg')) {
      return
    }
    if (placingComponent) {
      const rect = e.currentTarget.getBoundingClientRect()
      const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport)
      onPlaceComponent(placingComponent, snap(world.x), snap(world.y))
    } else {
      onSelectComponent(null)
    }
  }, [placingComponent, screenToWorld, viewport, onPlaceComponent, onSelectComponent])

  const handleCompMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (wiringState.active) return
    if (e.button !== 0) return
    const comp = circuit.components.find(c => c.id === id)
    if (!comp) return
    e.stopPropagation()
    draggingComp.current = {
      id,
      startX: comp.x,
      startY: comp.y,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    }
  }, [wiringState.active, circuit.components])

  const ghostSnappedX = snap(mousePos.x)
  const ghostSnappedY = snap(mousePos.y)

  const tempWireData = wiringState.active && wiringState.startPin
    ? {
        x1: wiringState.startPin.worldX,
        y1: wiringState.startPin.worldY,
        x2: mousePos.x,
        y2: mousePos.y,
      }
    : null

  const canvasW = 4000
  const canvasH = 3000

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative select-none"
      style={{
        background: '#0a0c10',
        backgroundImage: 'radial-gradient(circle, #1e2433 1px, transparent 1px)',
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        cursor: placingComponent ? 'crosshair' : wiringState.active ? 'crosshair' : 'default',
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          width: canvasW,
          height: canvasH,
          position: 'relative',
        }}
      >
        <WireLayer
          wires={circuit.wires}
          width={canvasW}
          height={canvasH}
          tempWire={tempWireData}
          onWireClick={onWireClick}
        />

        {circuit.components.map(comp => (
          <SimComponent
            key={comp.id}
            component={comp}
            selected={comp.id === selectedId}
            onSelect={onSelectComponent}
            onPinClick={onPinClick}
            onToggleSwitch={onToggleSwitch}
            onMouseDown={handleCompMouseDown}
          />
        ))}

        {placingComponent && (() => {
          const tmpl = COMPONENT_TEMPLATES[placingComponent]
          const ghost = createComponent(placingComponent, ghostSnappedX, ghostSnappedY)
          return (
            <div
              style={{
                position: 'absolute',
                left: ghostSnappedX,
                top: ghostSnappedY,
                width: tmpl.width,
                height: tmpl.height,
                border: '2px dashed #00d4ff',
                borderRadius: 8,
                backgroundColor: 'rgba(0,212,255,0.1)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="text-signal text-xs font-mono">{tmpl.label}</span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
