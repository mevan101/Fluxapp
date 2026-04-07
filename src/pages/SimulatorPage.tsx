import { useState, useCallback, useEffect, useRef } from 'react'
import { CircuitComponent, Pin, ComponentType, Circuit } from '../types/circuit'
import { AND_GATE_DEMO } from '../data/sampleCircuits'
import { useSimulation } from '../hooks/useSimulation'
import { useCanvas } from '../hooks/useCanvas'
import { useWiring } from '../hooks/useWiring'
import Toolbar from '../components/simulator/Toolbar'
import ComponentPanel from '../components/simulator/ComponentPanel'
import SimulatorCanvas from '../components/simulator/SimulatorCanvas'
import AITutorPanel from '../components/simulator/AITutorPanel'
import OscilloscopePanel from '../components/simulator/OscilloscopePanel'

const STORAGE_KEY = 'flux-saved-circuit'

function getInitialCircuit(): Circuit {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const c = JSON.parse(raw) as Circuit
      // Clear it so next visit starts fresh unless saved again
      localStorage.removeItem(STORAGE_KEY)
      return c
    }
  } catch { /* ignore */ }
  return AND_GATE_DEMO
}

export default function SimulatorPage() {
  const {
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
  } = useSimulation(getInitialCircuit())

  const { viewport, canvasRef, screenToWorld } = useCanvas()
  const { wiringState, beginWire, endWire, cancelWire, updateMousePos } = useWiring()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [placingComponent, setPlacingComponent] = useState<ComponentType | null>(null)
  const [circuitName, setCircuitName] = useState(AND_GATE_DEMO.name)

  // Wire history for oscilloscope
  const wireHistoryRef = useRef<Record<string, (0 | 1)[]>>({})

  useEffect(() => {
    circuit.wires.forEach(w => {
      if (!wireHistoryRef.current[w.id]) wireHistoryRef.current[w.id] = []
      const hist = wireHistoryRef.current[w.id]
      hist.push(w.signal)
      if (hist.length > 100) hist.shift()
    })
  }, [circuit.wires])

  const handlePinClick = useCallback((comp: CircuitComponent, pin: Pin, e: React.MouseEvent) => {
    e.stopPropagation()

    const pinWorldX = comp.x + pin.position.x
    const pinWorldY = comp.y + pin.position.y

    if (!wiringState.active) {
      if (pin.type === 'output') {
        beginWire({ componentId: comp.id, pinId: pin.id, pinType: 'output', worldX: pinWorldX, worldY: pinWorldY })
      }
    } else {
      if (pin.type === 'input') {
        endWire(
          { componentId: comp.id, pinId: pin.id, pinType: 'input', worldX: pinWorldX, worldY: pinWorldY },
          addWire,
        )
      } else {
        // Clicked another output — restart wiring from this pin
        cancelWire()
        beginWire({ componentId: comp.id, pinId: pin.id, pinType: 'output', worldX: pinWorldX, worldY: pinWorldY })
      }
    }
  }, [wiringState.active, beginWire, endWire, cancelWire, addWire])

  const handlePlaceComponent = useCallback((type: ComponentType, x: number, y: number) => {
    addComponent(type, x, y)
    setPlacingComponent(null)
  }, [addComponent])

  const handleWireClick = useCallback((wireId: string) => {
    if (confirm('Delete this wire?')) removeWire(wireId)
  }, [removeWire])

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelWire()
        setPlacingComponent(null)
        setSelectedId(null)
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && document.activeElement?.tagName !== 'INPUT') {
          removeComponent(selectedId)
          setSelectedId(null)
        }
      }
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        if (isRunning) stopSimulation()
        else startSimulation()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cancelWire, selectedId, removeComponent, isRunning, startSimulation, stopSimulation, undo])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (wiringState.active) {
      const rect = e.currentTarget.getBoundingClientRect()
      const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport)
      updateMousePos(world.x, world.y)
    }
  }, [wiringState.active, screenToWorld, viewport, updateMousePos])

  return (
    <div
      className="flex flex-col bg-canvas"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <Toolbar
        circuitName={circuitName}
        isRunning={isRunning}
        speed={speed}
        componentCount={circuit.components.length}
        wireCount={circuit.wires.length}
        circuit={circuit}
        onNameChange={setCircuitName}
        onPlay={startSimulation}
        onPause={stopSimulation}
        onStep={stepSimulation}
        onSpeedChange={setSpeed}
        onLoadCircuit={setCircuit}
        onUndo={undo}
      />

      <div className="flex flex-1 min-h-0">
        <ComponentPanel onSelectComponent={type => setPlacingComponent(type)} />

        <div
          className="flex-1 relative"
          onMouseMove={handleCanvasMouseMove}
        >
          <SimulatorCanvas
            circuit={circuit}
            viewport={viewport}
            canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
            wiringState={wiringState}
            placingComponent={placingComponent}
            selectedId={selectedId}
            onSelectComponent={id => setSelectedId(id)}
            onPinClick={handlePinClick}
            onToggleSwitch={toggleSwitch}
            onPlaceComponent={handlePlaceComponent}
            onMoveComponent={moveComponent}
            onWireClick={handleWireClick}
            screenToWorld={screenToWorld}
          />

          <OscilloscopePanel
            wires={circuit.wires}
            wireHistory={wireHistoryRef.current}
          />
        </div>

        <AITutorPanel
          componentCount={circuit.components.length}
          wireCount={circuit.wires.length}
        />
      </div>
    </div>
  )
}
