import { CircuitComponent, Pin } from '../../types/circuit'

const SEVEN_SEG_ON_COLOR = '#ff4500'
const SEVEN_SEG_OFF_COLOR = '#2a1a0a'
const SEVEN_SEG_STROKE_WIDTH = 4

interface SimComponentProps {
  component: CircuitComponent
  selected: boolean
  onSelect: (id: string) => void
  onPinClick: (component: CircuitComponent, pin: Pin, e: React.MouseEvent) => void
  onToggleSwitch: (id: string) => void
  onMouseDown?: (e: React.MouseEvent, id: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  AND: 'text-cyan-400',
  OR: 'text-cyan-400',
  NOT: 'text-cyan-400',
  XOR: 'text-cyan-400',
  NAND: 'text-cyan-400',
  NOR: 'text-cyan-400',
  LED: 'text-green-400',
  SWITCH: 'text-green-400',
  CLOCK: 'text-green-400',
  VCC: 'text-yellow-400',
  GND: 'text-yellow-400',
  D_FLIP_FLOP: 'text-purple-400',
  JK_FLIP_FLOP: 'text-purple-400',
  MUX: 'text-orange-400',
  SEVEN_SEG: 'text-orange-400',
  HALF_ADDER: 'text-orange-400',
  FULL_ADDER: 'text-orange-400',
}

function PinDot({ pin, component, onPinClick }: {
  pin: Pin
  component: CircuitComponent
  onPinClick: (component: CircuitComponent, pin: Pin, e: React.MouseEvent) => void
}) {
  const isOutput = pin.type === 'output'
  const active = pin.signal === 1
  return (
    <div
      style={{
        position: 'absolute',
        left: pin.position.x - 5,
        top: pin.position.y - 5,
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: active ? '#00d4ff' : isOutput ? '#374151' : '#1f2937',
        border: `2px solid ${active ? '#00d4ff' : isOutput ? '#4b5563' : '#374151'}`,
        cursor: 'crosshair',
        zIndex: 10,
        boxShadow: active ? '0 0 6px #00d4ff' : 'none',
        transition: 'background-color 0.1s, box-shadow 0.1s',
      }}
      onClick={e => { e.stopPropagation(); onPinClick(component, pin, e) }}
      title={`${pin.name} (${pin.type}) = ${pin.signal}`}
    />
  )
}

function ComponentBody({ component, selected }: { component: CircuitComponent; selected: boolean }) {
  const colorClass = CATEGORY_COLORS[component.type] ?? 'text-gray-300'
  const { type } = component

  if (type === 'LED') {
    const lit = component.pins[0]?.signal === 1
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
        <div
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
            lit
              ? 'bg-cyan-400 border-cyan-300 led-on'
              : 'bg-gray-800 border-gray-600'
          }`}
        />
        <span className={`text-xs font-mono ${colorClass}`}>LED</span>
      </div>
    )
  }

  if (type === 'SWITCH') {
    const on = component.state.value === 1
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 pointer-events-none">
        <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${on ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
          {on ? '1' : '0'}
        </div>
        <span className={`text-xs font-mono ${colorClass}`}>SW</span>
      </div>
    )
  }

  if (type === 'CLOCK') {
    const on = component.state.value === 1
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
        <div className={`text-lg font-mono ${on ? 'text-cyan-400 clock-pulse' : 'text-gray-500'}`}>⏱</div>
        <span className={`text-xs font-mono ${colorClass}`}>CLK</span>
      </div>
    )
  }

  if (type === 'VCC') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <span className="text-yellow-400 text-lg font-bold">+</span>
        <span className="text-yellow-400 text-xs font-mono">VCC</span>
      </div>
    )
  }

  if (type === 'GND') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <span className="text-yellow-400 text-xs font-mono">GND</span>
        <span className="text-yellow-400 text-lg font-bold">⏚</span>
      </div>
    )
  }

  if (type === 'SEVEN_SEG') {
    // Segments: A=top, B=top-right, C=bottom-right, D=bottom, E=bottom-left, F=top-left, G=middle
    const pinNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const segs: Record<string, 0 | 1> = {}
    for (const name of pinNames) {
      const pin = component.pins.find(p => p.name === name)
      segs[name] = pin?.signal ?? 0
    }
    const on = SEVEN_SEG_ON_COLOR
    const off = SEVEN_SEG_OFF_COLOR
    const sw = SEVEN_SEG_STROKE_WIDTH
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
        <svg width={32} height={52} viewBox="0 0 32 52">
          {/* A - top */}
          <line x1={6} y1={3} x2={26} y2={3} stroke={segs['A'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          {/* F - top-left */}
          <line x1={4} y1={5} x2={4} y2={23} stroke={segs['F'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          {/* B - top-right */}
          <line x1={28} y1={5} x2={28} y2={23} stroke={segs['B'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          {/* G - middle */}
          <line x1={6} y1={26} x2={26} y2={26} stroke={segs['G'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          {/* E - bottom-left */}
          <line x1={4} y1={28} x2={4} y2={46} stroke={segs['E'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          {/* C - bottom-right */}
          <line x1={28} y1={28} x2={28} y2={46} stroke={segs['C'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          {/* D - bottom */}
          <line x1={6} y1={49} x2={26} y2={49} stroke={segs['D'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
        </svg>
        <span className="text-orange-400 text-xs font-mono" style={{ fontSize: 9 }}>7-SEG</span>
      </div>
    )
  }

  const symbols: Partial<Record<string, string>> = {
    AND: '&', OR: '≥1', NOT: '1', XOR: '=1', NAND: '&̄', NOR: '≥1̄',
    D_FLIP_FLOP: 'DFF', JK_FLIP_FLOP: 'JK-FF',
    MUX: 'MUX', HALF_ADDER: 'HA', FULL_ADDER: 'FA',
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
      <span className={`text-sm font-mono font-bold ${colorClass}`}>{symbols[type] ?? type}</span>
      <span className="text-xs text-gray-500 font-mono">{component.label}</span>
    </div>
  )
}

export default function SimComponent({
  component,
  selected,
  onSelect,
  onPinClick,
  onToggleSwitch,
  onMouseDown,
}: SimComponentProps) {
  const { x, y, width, height, type } = component

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
      }}
      onClick={e => { e.stopPropagation(); onSelect(component.id) }}
      onMouseDown={e => onMouseDown?.(e, component.id)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1f2e',
          border: `2px solid ${selected ? '#00d4ff' : '#374151'}`,
          borderRadius: 8,
          boxShadow: selected ? '0 0 12px rgba(0,212,255,0.4)' : '0 2px 4px rgba(0,0,0,0.5)',
          cursor: type === 'SWITCH' ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'visible',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          userSelect: 'none',
        }}
        onDoubleClick={() => { if (type === 'SWITCH') onToggleSwitch(component.id) }}
        onClick={e => { if (type === 'SWITCH') { e.stopPropagation(); onToggleSwitch(component.id) } else onSelect(component.id) }}
      >
        <ComponentBody component={component} selected={selected} />

        {component.pins.map(pin => (
          <PinDot key={pin.id} pin={pin} component={component} onPinClick={onPinClick} />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: height + 4,
          left: 0,
          width,
          textAlign: 'center',
          fontSize: 10,
          color: selected ? '#00d4ff' : '#6b7280',
          fontFamily: 'JetBrains Mono, monospace',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {component.label}
      </div>
    </div>
  )
}
