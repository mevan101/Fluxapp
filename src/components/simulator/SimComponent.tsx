import { useState, useEffect, useRef, useCallback } from 'react'
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
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onRename?: (id: string) => void
  onLabelChange?: (id: string, newLabel: string) => void
  lightMode?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  AND: 'text-cyan-400', OR: 'text-cyan-400', NOT: 'text-cyan-400',
  XOR: 'text-cyan-400', NAND: 'text-cyan-400', NOR: 'text-cyan-400',
  XNOR: 'text-cyan-400', BUFFER: 'text-cyan-400',
  AND3: 'text-cyan-400', OR3: 'text-cyan-400', NAND3: 'text-cyan-400',
  NOR3: 'text-cyan-400', XOR3: 'text-cyan-400',
  LED: 'text-green-400', SWITCH: 'text-green-400', CLOCK: 'text-green-400',
  PROBE: 'text-green-400', BUZZER: 'text-green-400',
  VCC: 'text-yellow-400', GND: 'text-yellow-400',
  D_FLIP_FLOP: 'text-purple-400', JK_FLIP_FLOP: 'text-purple-400',
  T_FLIP_FLOP: 'text-purple-400', SR_LATCH: 'text-purple-400',
  MUX: 'text-orange-400', SEVEN_SEG: 'text-orange-400',
  HALF_ADDER: 'text-orange-400', FULL_ADDER: 'text-orange-400',
  DECODER_2_4: 'text-orange-400', DEMUX: 'text-orange-400',
  TEXT_LABEL: 'text-gray-300', BREADBOARD: 'text-gray-400',
}

// SVG gate body for logic gates
function GateSymbol({ type, w, h }: { type: string; w: number; h: number }) {
  const cx = '#00d4ff'
  const gray = '#4b5563'
  const strokeW = 2

  if (type === 'AND' || type === 'NAND') {
    const bx = 12, by = 8, bw = w - 24, bh = h - 16
    const bubbleR = 4
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {/* AND D-shape body */}
        <path
          d={`M ${bx},${by} L ${bx},${by + bh} L ${bx + bw * 0.5},${by + bh} Q ${bx + bw},${by + bh} ${bx + bw},${by + bh / 2} Q ${bx + bw},${by} ${bx + bw * 0.5},${by} Z`}
          fill="#1e2a3a" stroke={cx} strokeWidth={strokeW}
        />
        {/* input lines */}
        <line x1={0} y1={h * 0.25} x2={bx} y2={h * 0.25} stroke={gray} strokeWidth={1.5} />
        <line x1={0} y1={h * 0.75} x2={bx} y2={h * 0.75} stroke={gray} strokeWidth={1.5} />
        {/* output line */}
        {type === 'NAND' ? (
          <>
            <line x1={bx + bw} y1={h / 2} x2={w - bubbleR * 2 - 2} y2={h / 2} stroke={gray} strokeWidth={1.5} />
            <circle cx={w - bubbleR} cy={h / 2} r={bubbleR} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
          </>
        ) : (
          <line x1={bx + bw} y1={h / 2} x2={w} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        )}
        <text x={bx + bw * 0.3} y={h / 2 + 4} fill={cx} fontSize={10} fontFamily="monospace">{type === 'NAND' ? 'NAND' : 'AND'}</text>
      </svg>
    )
  }

  if (type === 'OR' || type === 'NOR') {
    const bx = 10, by = 8, bw = w - 24, bh = h - 16
    const bubbleR = 4
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <path
          d={`M ${bx},${by} Q ${bx + bw * 0.5},${by} ${bx + bw},${by + bh / 2} Q ${bx + bw * 0.5},${by + bh} ${bx},${by + bh} Q ${bx + bw * 0.3},${by + bh / 2} ${bx},${by} Z`}
          fill="#1e2a3a" stroke={cx} strokeWidth={strokeW}
        />
        <line x1={0} y1={h * 0.25} x2={bx + 4} y2={h * 0.25} stroke={gray} strokeWidth={1.5} />
        <line x1={0} y1={h * 0.75} x2={bx + 4} y2={h * 0.75} stroke={gray} strokeWidth={1.5} />
        {type === 'NOR' ? (
          <>
            <line x1={bx + bw} y1={h / 2} x2={w - bubbleR * 2 - 2} y2={h / 2} stroke={gray} strokeWidth={1.5} />
            <circle cx={w - bubbleR} cy={h / 2} r={bubbleR} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
          </>
        ) : (
          <line x1={bx + bw} y1={h / 2} x2={w} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        )}
        <text x={bx + bw * 0.25} y={h / 2 + 4} fill={cx} fontSize={10} fontFamily="monospace">{type === 'NOR' ? 'NOR' : 'OR'}</text>
      </svg>
    )
  }

  if (type === 'XOR' || type === 'XNOR') {
    const bx = 14, by = 8, bw = w - 26, bh = h - 16
    const bubbleR = 4
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {/* extra arc at input */}
        <path d={`M ${bx - 6},${by} Q ${bx - 2},${by + bh / 2} ${bx - 6},${by + bh}`} fill="none" stroke={cx} strokeWidth={strokeW} />
        {/* OR body */}
        <path
          d={`M ${bx},${by} Q ${bx + bw * 0.5},${by} ${bx + bw},${by + bh / 2} Q ${bx + bw * 0.5},${by + bh} ${bx},${by + bh} Q ${bx + bw * 0.3},${by + bh / 2} ${bx},${by} Z`}
          fill="#1e2a3a" stroke={cx} strokeWidth={strokeW}
        />
        <line x1={0} y1={h * 0.25} x2={bx + 4} y2={h * 0.25} stroke={gray} strokeWidth={1.5} />
        <line x1={0} y1={h * 0.75} x2={bx + 4} y2={h * 0.75} stroke={gray} strokeWidth={1.5} />
        {type === 'XNOR' ? (
          <>
            <line x1={bx + bw} y1={h / 2} x2={w - bubbleR * 2 - 2} y2={h / 2} stroke={gray} strokeWidth={1.5} />
            <circle cx={w - bubbleR} cy={h / 2} r={bubbleR} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
          </>
        ) : (
          <line x1={bx + bw} y1={h / 2} x2={w} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        )}
        <text x={bx + bw * 0.15} y={h / 2 + 4} fill={cx} fontSize={9} fontFamily="monospace">{type === 'XNOR' ? 'XNOR' : 'XOR'}</text>
      </svg>
    )
  }

  if (type === 'NOT') {
    const bubbleR = 4
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <polygon points={`8,4 8,${h - 4} ${w - bubbleR * 2 - 6},${h / 2}`} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
        <circle cx={w - bubbleR} cy={h / 2} r={bubbleR} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
        <line x1={0} y1={h / 2} x2={8} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        <text x={12} y={h / 2 + 4} fill={cx} fontSize={9} fontFamily="monospace">NOT</text>
      </svg>
    )
  }

  if (type === 'BUFFER') {
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <polygon points={`8,4 8,${h - 4} ${w - 6},${h / 2}`} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
        <line x1={0} y1={h / 2} x2={8} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        <line x1={w - 6} y1={h / 2} x2={w} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        <text x={12} y={h / 2 + 4} fill={cx} fontSize={9} fontFamily="monospace">BUF</text>
      </svg>
    )
  }

  // 3-input gate variants
  if (type === 'AND3' || type === 'NAND3') {
    const bx = 12, by = 8, bw = w - 24, bh = h - 16
    const bubbleR = 4
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <path
          d={`M ${bx},${by} L ${bx},${by + bh} L ${bx + bw * 0.5},${by + bh} Q ${bx + bw},${by + bh} ${bx + bw},${by + bh / 2} Q ${bx + bw},${by} ${bx + bw * 0.5},${by} Z`}
          fill="#1e2a3a" stroke={cx} strokeWidth={strokeW}
        />
        <line x1={0} y1={h * 0.19} x2={bx} y2={h * 0.19} stroke={gray} strokeWidth={1.5} />
        <line x1={0} y1={h * 0.5} x2={bx} y2={h * 0.5} stroke={gray} strokeWidth={1.5} />
        <line x1={0} y1={h * 0.81} x2={bx} y2={h * 0.81} stroke={gray} strokeWidth={1.5} />
        {type === 'NAND3' ? (
          <>
            <line x1={bx + bw} y1={h / 2} x2={w - bubbleR * 2 - 2} y2={h / 2} stroke={gray} strokeWidth={1.5} />
            <circle cx={w - bubbleR} cy={h / 2} r={bubbleR} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
          </>
        ) : (
          <line x1={bx + bw} y1={h / 2} x2={w} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        )}
        <text x={bx + 6} y={h / 2 + 4} fill={cx} fontSize={9} fontFamily="monospace">{type === 'NAND3' ? 'NAND3' : 'AND3'}</text>
      </svg>
    )
  }

  if (type === 'OR3' || type === 'NOR3' || type === 'XOR3') {
    const bx = 10, by = 8, bw = w - 24, bh = h - 16
    const bubbleR = 4
    const isXOR = type === 'XOR3'
    const isNOR = type === 'NOR3'
    return (
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {isXOR && <path d={`M ${bx - 6},${by} Q ${bx - 2},${by + bh / 2} ${bx - 6},${by + bh}`} fill="none" stroke={cx} strokeWidth={strokeW} />}
        <path
          d={`M ${bx},${by} Q ${bx + bw * 0.5},${by} ${bx + bw},${by + bh / 2} Q ${bx + bw * 0.5},${by + bh} ${bx},${by + bh} Q ${bx + bw * 0.3},${by + bh / 2} ${bx},${by} Z`}
          fill="#1e2a3a" stroke={cx} strokeWidth={strokeW}
        />
        <line x1={0} y1={h * 0.19} x2={bx + (isXOR ? 8 : 4)} y2={h * 0.19} stroke={gray} strokeWidth={1.5} />
        <line x1={0} y1={h * 0.5} x2={bx + (isXOR ? 6 : 2)} y2={h * 0.5} stroke={gray} strokeWidth={1.5} />
        <line x1={0} y1={h * 0.81} x2={bx + (isXOR ? 8 : 4)} y2={h * 0.81} stroke={gray} strokeWidth={1.5} />
        {(isNOR || isXOR && false) ? (
          <>
            <line x1={bx + bw} y1={h / 2} x2={w - bubbleR * 2 - 2} y2={h / 2} stroke={gray} strokeWidth={1.5} />
            <circle cx={w - bubbleR} cy={h / 2} r={bubbleR} fill="#1e2a3a" stroke={cx} strokeWidth={strokeW} />
          </>
        ) : (
          <line x1={bx + bw} y1={h / 2} x2={w} y2={h / 2} stroke={gray} strokeWidth={1.5} />
        )}
        <text x={bx + 4} y={h / 2 + 4} fill={cx} fontSize={9} fontFamily="monospace">{type}</text>
      </svg>
    )
  }

  return null
}

function PinDot({ pin, component, onPinClick, lightMode }: {
  pin: Pin
  component: CircuitComponent
  onPinClick: (component: CircuitComponent, pin: Pin, e: React.MouseEvent) => void
  lightMode?: boolean
}) {
  const isOutput = pin.type === 'output'
  const active = pin.signal === 1
  // Hide dummy pins for TEXT_LABEL and BREADBOARD
  if ((component.type === 'TEXT_LABEL' || component.type === 'BREADBOARD') && pin.name === '_') return null
  return (
    <div style={{ position: 'absolute', left: pin.position.x, top: pin.position.y - 5, pointerEvents: 'none' }}>
      {/* Pin label */}
      <span style={{
        position: 'absolute',
        fontSize: 7,
        fontFamily: 'monospace',
        color: lightMode ? '#374151' : '#9ca3af',
        top: -8,
        left: isOutput ? -14 : 6,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>{pin.name}</span>
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: 0,
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
    </div>
  )
}

const GATE_TYPES = new Set(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR', 'BUFFER', 'AND3', 'OR3', 'NAND3', 'NOR3', 'XOR3'])

function ComponentBody({ component, selected, lightMode, onLabelChange }: {
  component: CircuitComponent
  selected: boolean
  lightMode?: boolean
  onLabelChange?: (id: string, newLabel: string) => void
}) {
  const colorClass = CATEGORY_COLORS[component.type] ?? 'text-gray-300'
  const { type, width, height } = component
  const [editingLabel, setEditingLabel] = useState(false)
  const [draftLabel, setDraftLabel] = useState(component.label)

  if (GATE_TYPES.has(type)) {
    return (
      <div className="w-full h-full" style={{ position: 'relative' }}>
        <GateSymbol type={type} w={width} h={height} />
      </div>
    )
  }

  if (type === 'LED') {
    const lit = component.pins[0]?.signal === 1
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
        <div
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
            lit ? 'bg-cyan-400 border-cyan-300 led-on' : lightMode ? 'bg-gray-200 border-gray-400' : 'bg-gray-800 border-gray-600'
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
        <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${on ? 'bg-cyan-500 text-black' : lightMode ? 'bg-gray-300 text-gray-600' : 'bg-gray-700 text-gray-400'}`}>
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

  if (type === 'PROBE') {
    const val = component.pins[0]?.signal ?? 0
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
        <div
          className={`text-2xl font-mono font-bold transition-colors ${val === 1 ? 'text-cyan-400' : 'text-gray-500'}`}
          style={{ lineHeight: 1 }}
        >
          {val}
        </div>
        <span className="text-xs font-mono text-green-400">PRB</span>
      </div>
    )
  }

  if (type === 'BUZZER') {
    const active = component.pins[0]?.signal === 1
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
        <div
          className={`text-2xl transition-all ${active ? 'text-cyan-400' : 'text-gray-500'}`}
          style={{ transform: active ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.15s' }}
        >
          🔊
        </div>
        <span className="text-xs font-mono text-green-400" style={{ fontSize: 9 }}>{active ? 'ACTIVE' : 'SILENT'}</span>
      </div>
    )
  }

  if (type === 'TEXT_LABEL') {
    if (editingLabel) {
      return (
        <div className="w-full h-full flex items-center justify-center px-1">
          <input
            autoFocus
            value={draftLabel}
            onChange={e => setDraftLabel(e.target.value)}
            onBlur={() => { onLabelChange?.(component.id, draftLabel); setEditingLabel(false) }}
            onKeyDown={e => {
              if (e.key === 'Enter') { onLabelChange?.(component.id, draftLabel); setEditingLabel(false) }
              if (e.key === 'Escape') { setDraftLabel(component.label); setEditingLabel(false) }
              e.stopPropagation()
            }}
            className="w-full bg-gray-800 border border-signal rounded px-1 py-0.5 text-xs text-white font-mono focus:outline-none"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )
    }
    return (
      <div
        className="w-full h-full flex items-center justify-center px-2"
        onDoubleClick={e => { e.stopPropagation(); setEditingLabel(true) }}
      >
        <span className="text-xs font-mono text-gray-200 break-all text-center">{component.label}</span>
      </div>
    )
  }

  if (type === 'BREADBOARD') {
    // Visual breadboard grid
    const rows = 30
    const cols = 10 // a-j
    const holeR = 3
    const railH = 16
    const gridStartY = railH + 8
    const cellW = (width - 20) / cols
    const cellH = (height - railH * 2 - 20) / rows
    return (
      <div className="w-full h-full" style={{ overflow: 'hidden', padding: 4 }}>
        <svg width={width - 8} height={height - 8} style={{ display: 'block' }}>
          {/* Top power rail */}
          <rect x={0} y={0} width={width - 8} height={railH} rx={2} fill="#1a0a0a" stroke="#ef4444" strokeWidth={1} />
          <text x={4} y={11} fill="#ef4444" fontSize={8} fontFamily="monospace">+ VCC</text>
          {/* Bottom power rail */}
          <rect x={0} y={height - 8 - railH} width={width - 8} height={railH} rx={2} fill="#0a0a1a" stroke="#3b82f6" strokeWidth={1} />
          <text x={4} y={height - 8 - railH + 11} fill="#3b82f6" fontSize={8} fontFamily="monospace">− GND</text>
          {/* Grid holes */}
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => {
              const x = 10 + col * cellW + cellW / 2
              const y = gridStartY + row * cellH + cellH / 2
              const isMidGap = col === 5
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={x + (isMidGap ? 4 : 0)}
                  cy={y}
                  r={holeR}
                  fill="#0d1117"
                  stroke="#374151"
                  strokeWidth={0.5}
                />
              )
            })
          )}
          {/* Column labels a-e, f-j */}
          {['a','b','c','d','e','','f','g','h','i','j'].map((lbl, i) => (
            lbl ? <text key={i} x={10 + i * cellW + cellW / 2 - 3} y={gridStartY - 2} fill="#4b5563" fontSize={7} fontFamily="monospace">{lbl}</text> : null
          ))}
        </svg>
      </div>
    )
  }

  if (type === 'SEVEN_SEG') {
    const pinNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const segs: Record<string, 0 | 1> = {}
    for (const name of pinNames) {
      const pin = component.pins.find(p => p.name === name)
      segs[name] = pin?.signal ?? 0
    }
    const on = SEVEN_SEG_ON_COLOR, off = SEVEN_SEG_OFF_COLOR, sw = SEVEN_SEG_STROKE_WIDTH
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
        <svg width={32} height={52} viewBox="0 0 32 52">
          <line x1={6} y1={3} x2={26} y2={3} stroke={segs['A'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          <line x1={4} y1={5} x2={4} y2={23} stroke={segs['F'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          <line x1={28} y1={5} x2={28} y2={23} stroke={segs['B'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          <line x1={6} y1={26} x2={26} y2={26} stroke={segs['G'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          <line x1={4} y1={28} x2={4} y2={46} stroke={segs['E'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          <line x1={28} y1={28} x2={28} y2={46} stroke={segs['C'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
          <line x1={6} y1={49} x2={26} y2={49} stroke={segs['D'] ? on : off} strokeWidth={sw} strokeLinecap="round" />
        </svg>
        <span className="text-orange-400 text-xs font-mono" style={{ fontSize: 9 }}>7-SEG</span>
      </div>
    )
  }

  // Generic box for remaining types: D_FLIP_FLOP, JK_FLIP_FLOP, T_FLIP_FLOP, SR_LATCH, MUX, HALF_ADDER, FULL_ADDER, DECODER_2_4, DEMUX
  const symbols: Partial<Record<string, string>> = {
    D_FLIP_FLOP: 'D-FF', JK_FLIP_FLOP: 'JK-FF', T_FLIP_FLOP: 'T-FF', SR_LATCH: 'SR',
    MUX: 'MUX', HALF_ADDER: 'HA', FULL_ADDER: 'FA',
    DECODER_2_4: '2:4', DEMUX: '1:2',
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
      <span className={`text-sm font-mono font-bold ${colorClass}`}>{symbols[type] ?? type}</span>
      <span className="text-xs text-gray-500 font-mono">{component.label}</span>
    </div>
  )
}

// Context menu component
function ContextMenu({ x, y, onDelete, onDuplicate, onRename, onClose }: {
  x: number; y: number
  onDelete: () => void
  onDuplicate: () => void
  onRename: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', keyHandler) }
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 9999,
        background: '#1e2433',
        border: '1px solid #374151',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        minWidth: 130,
        overflow: 'hidden',
      }}
    >
      {[
        { icon: '🗑', label: 'Delete', action: onDelete, color: '#ef4444' },
        { icon: '📋', label: 'Duplicate', action: onDuplicate, color: '#60a5fa' },
        { icon: '✏️', label: 'Rename', action: onRename, color: '#a78bfa' },
      ].map(item => (
        <button
          key={item.label}
          onClick={e => { e.stopPropagation(); item.action(); onClose() }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '7px 12px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: item.color, fontSize: 12, fontFamily: 'monospace',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
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
  onDelete,
  onDuplicate,
  onRename,
  onLabelChange,
  lightMode,
}: SimComponentProps) {
  const { x, y, width, height, type } = component
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCtxMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const bgColor = lightMode ? '#ffffff' : '#1a1f2e'
  const borderColor = selected ? '#00d4ff' : lightMode ? '#d1d5db' : '#374151'

  return (
    <div
      style={{ position: 'absolute', left: x, top: y, width, height }}
      onClick={e => { e.stopPropagation(); onSelect(component.id) }}
      onMouseDown={e => onMouseDown?.(e, component.id)}
      onContextMenu={handleContextMenu}
    >
      <div
        style={{
          width: '100%', height: '100%',
          backgroundColor: bgColor,
          border: `2px solid ${borderColor}`,
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
        <ComponentBody component={component} selected={selected} lightMode={lightMode} onLabelChange={onLabelChange} />

        {component.pins.map(pin => (
          <PinDot key={pin.id} pin={pin} component={component} onPinClick={onPinClick} lightMode={lightMode} />
        ))}
      </div>

      {type !== 'TEXT_LABEL' && (
        <div
          style={{
            position: 'absolute', top: height + 4, left: 0, width,
            textAlign: 'center', fontSize: 10,
            color: selected ? '#00d4ff' : lightMode ? '#374151' : '#6b7280',
            fontFamily: 'JetBrains Mono, monospace',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}
        >
          {component.label}
        </div>
      )}

      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          onDelete={() => onDelete?.(component.id)}
          onDuplicate={() => onDuplicate?.(component.id)}
          onRename={() => onRename?.(component.id)}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </div>
  )
}
