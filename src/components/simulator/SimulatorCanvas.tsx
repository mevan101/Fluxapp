import { useRef, useCallback, useState } from 'react'
import { Circuit, CircuitComponent, Pin, ComponentType } from '../../types/circuit'
import { Viewport } from '../../hooks/useCanvas'
import { WiringState } from '../../hooks/useWiring'
import SimComponent from './SimComponent'
import WireLayer from './WireLayer'
import { COMPONENT_TEMPLATES } from '../../data/components'

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
  onCancelWire?: () => void
  onDeleteComponent?: (id: string) => void
  onDuplicateComponent?: (id: string) => void
  onRenameComponent?: (id: string) => void
  onLabelChange?: (id: string, newLabel: string) => void
  screenToWorld: (sx: number, sy: number, vp: Viewport) => { x: number; y: number }
  lightMode?: boolean
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
  onCancelWire,
  onDeleteComponent,
  onDuplicateComponent,
  onRenameComponent,
  onLabelChange,
  screenToWorld,
  lightMode,
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
    // SimComponent calls e.stopPropagation() on click, so any event that reaches
    // the outer canvas div is from empty space — safe to handle here
    if (placingComponent) {
      const rect = e.currentTarget.getBoundingClientRect()
      const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport)
      onPlaceComponent(placingComponent, snap(world.x), snap(world.y))
    } else {
      onSelectComponent(null)
    }
  }, [placingComponent, screenToWorld, viewport, onPlaceComponent, onSelectComponent])

  const handleCanvasContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Cancel wiring on right-click anywhere on canvas
    // SimComponent calls e.stopPropagation() on contextMenu so component right-clicks
    // won't reach here
    if (wiringState.active) {
      e.preventDefault()
      onCancelWire?.()
    }
  }, [wiringState.active, onCancelWire])

  const handleCompMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (wiringState.active) return
    if (e.button !== 0) return
    const comp = circuit.components.find(c => c.id === id)
    if (!comp) return
    e.stopPropagation()
    draggingComp.current = {
      id, startX: comp.x, startY: comp.y,
      startMouseX: e.clientX, startMouseY: e.clientY,
    }
  }, [wiringState.active, circuit.components])

  // Drag-and-drop from ComponentPanel
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('application/x-component-type')) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const type = e.dataTransfer.getData('application/x-component-type') as ComponentType
    if (!type) return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport)
    onPlaceComponent(type, snap(world.x), snap(world.y))
  }, [screenToWorld, viewport, onPlaceComponent])

  const ghostSnappedX = snap(mousePos.x)
  const ghostSnappedY = snap(mousePos.y)

  const tempWireData = wiringState.active && wiringState.startPin
    ? {
        x1: wiringState.startPin.worldX, y1: wiringState.startPin.worldY,
        x2: mousePos.x, y2: mousePos.y,
      }
    : null

  const canvasW = 4000, canvasH = 3000

  const bgStyle = lightMode
    ? {
        background: '#f0f2f5',
        backgroundImage: 'radial-gradient(circle, #c8d0dc 1px, transparent 1px)',
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
      }
    : {
        background: '#0a0c10',
        backgroundImage: 'radial-gradient(circle, #1e2433 1px, transparent 1px)',
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
      }

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative select-none"
      style={{
        ...bgStyle,
        cursor: placingComponent ? 'crosshair' : wiringState.active ? 'crosshair' : 'default',
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleCanvasContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Empty canvas hint overlay */}
      {circuit.components.length === 0 && !placingComponent && (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10,
          }}
        >
          <div style={{
            textAlign: 'center', padding: '32px 40px',
            background: 'rgba(10,12,16,0.7)', borderRadius: 16,
            border: '1px solid rgba(0,212,255,0.15)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
            <div style={{ color: '#00d4ff', fontSize: 18, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>
              FLUX Circuit Simulator
            </div>
            <div style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.7, maxWidth: 340 }}>
              <div>📦 Drag or click a component from the left panel</div>
              <div>🔗 Click an output pin → then an input pin to wire</div>
              <div>▶️ Hit <span style={{ color: '#00d4ff' }}>Simulate</span> to see signals flow</div>
              <div style={{ marginTop: 8 }}>Space + drag to pan &nbsp;·&nbsp; Scroll to zoom &nbsp;·&nbsp; ? for shortcuts</div>
            </div>
          </div>
        </div>
      )}

      {/* Active wiring hint */}
      {wiringState.active && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
          borderRadius: 8, padding: '6px 16px', pointerEvents: 'none', zIndex: 20,
          color: '#fbbf24', fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
          backdropFilter: 'blur(8px)',
        }}>
          🔗 Wiring… click an <strong>input pin</strong> to connect &nbsp;·&nbsp; Right-click or Esc to cancel
        </div>
      )}

      {/* Placement hint */}
      {placingComponent && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: 8, padding: '6px 16px', pointerEvents: 'none', zIndex: 20,
          color: '#00d4ff', fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
          backdropFilter: 'blur(8px)',
        }}>
          📦 Click to place <strong>{COMPONENT_TEMPLATES[placingComponent]?.label}</strong> &nbsp;·&nbsp; Esc to cancel
        </div>
      )}

      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          width: canvasW, height: canvasH,
          position: 'relative',
        }}
      >
        <WireLayer
          wires={circuit.wires}
          width={canvasW}
          height={canvasH}
          tempWire={tempWireData}
          onWireClick={onWireClick}
          lightMode={lightMode}
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
            onDelete={onDeleteComponent}
            onDuplicate={onDuplicateComponent}
            onRename={onRenameComponent}
            onLabelChange={onLabelChange}
            lightMode={lightMode}
          />
        ))}

        {placingComponent && (() => {
          const tmpl = COMPONENT_TEMPLATES[placingComponent]
          return (
            <div
              style={{
                position: 'absolute', left: ghostSnappedX, top: ghostSnappedY,
                width: tmpl.width, height: tmpl.height,
                border: '2px dashed #00d4ff', borderRadius: 8,
                backgroundColor: 'rgba(0,212,255,0.1)',
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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
