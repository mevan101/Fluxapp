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

  const { viewport, setViewport, canvasRef, screenToWorld } = useCanvas()
  const { wiringState, beginWire, endWire, cancelWire, updateMousePos } = useWiring()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [placingComponent, setPlacingComponent] = useState<ComponentType | null>(null)
  const [circuitName, setCircuitName] = useState(AND_GATE_DEMO.name)
  const [lightMode, setLightMode] = useState(false)

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

  const handleDeleteComponent = useCallback((id: string) => {
    removeComponent(id)
    if (selectedId === id) setSelectedId(null)
  }, [removeComponent, selectedId])

  const handleDuplicateComponent = useCallback((id: string) => {
    const comp = circuit.components.find(c => c.id === id)
    if (!comp) return
    addComponent(comp.type, comp.x + 40, comp.y + 40)
  }, [circuit.components, addComponent])

  const handleRenameComponent = useCallback((id: string) => {
    const comp = circuit.components.find(c => c.id === id)
    if (!comp) return
    const newLabel = prompt('Rename component:', comp.label)
    if (newLabel !== null && newLabel.trim()) {
      setCircuit(prev => ({
        ...prev,
        components: prev.components.map(c => c.id === id ? { ...c, label: newLabel.trim() } : c),
      }))
    }
  }, [circuit.components, setCircuit])

  const handleLabelChange = useCallback((id: string, newLabel: string) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === id ? { ...c, label: newLabel } : c),
    }))
  }, [setCircuit])

  const handleClear = useCallback(() => {
    setCircuit(prev => ({ ...prev, components: [], wires: [] }))
    setSelectedId(null)
    setPlacingComponent(null)
    cancelWire()
  }, [setCircuit, cancelWire])

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
      // Space is now used for pan in useCanvas — do NOT handle it here
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cancelWire, selectedId, removeComponent, undo])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (wiringState.active) {
      const rect = e.currentTarget.getBoundingClientRect()
      const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport)
      updateMousePos(world.x, world.y)
    }
  }, [wiringState.active, screenToWorld, viewport, updateMousePos])

  return (
    <div
      className={`flex flex-col ${lightMode ? 'bg-gray-100' : 'bg-canvas'}`}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <Toolbar
        circuitName={circuitName}
        isRunning={isRunning}
        speed={speed}
        componentCount={circuit.components.length}
        wireCount={circuit.wires.length}
        circuit={circuit}
        viewport={viewport}
        setViewport={setViewport}
        canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
        wiringState={wiringState}
        lightMode={lightMode}
        onNameChange={setCircuitName}
        onPlay={startSimulation}
        onPause={stopSimulation}
        onStep={stepSimulation}
        onSpeedChange={setSpeed}
        onLoadCircuit={setCircuit}
        onUndo={undo}
        onClear={handleClear}
        onCancelWire={cancelWire}
        onToggleLightMode={() => setLightMode(m => !m)}
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
            onCancelWire={cancelWire}
            onDeleteComponent={handleDeleteComponent}
            onDuplicateComponent={handleDuplicateComponent}
            onRenameComponent={handleRenameComponent}
            onLabelChange={handleLabelChange}
            screenToWorld={screenToWorld}
            lightMode={lightMode}
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
