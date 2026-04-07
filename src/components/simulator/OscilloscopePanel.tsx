import { useState, useRef, useEffect, useCallback } from 'react'
import { Minus, X, Activity } from 'lucide-react'
import { Wire } from '../../types/circuit'

interface OscilloscopePanelProps {
  wires: Wire[]
  wireHistory: Record<string, (0 | 1)[]>
}

const COLORS = ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#7c3aed', '#ec4899']

export default function OscilloscopePanel({ wires, wireHistory }: OscilloscopePanelProps) {
  const [minimized, setMinimized] = useState(false)
  const [monitored, setMonitored] = useState<Set<string>>(new Set())
  const [pos, setPos] = useState({ x: 20, y: 20 })
  const dragging = useRef(false)
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  useEffect(() => {
    if (wires.length > 0 && monitored.size === 0) {
      setMonitored(new Set([wires[0].id]))
    }
  }, [wires, monitored.size])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setPos({
        x: dragStart.current.px + e.clientX - dragStart.current.mx,
        y: dragStart.current.py + e.clientY - dragStart.current.my,
      })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const toggleMonitor = (wireId: string) => {
    setMonitored(prev => {
      const next = new Set(prev)
      if (next.has(wireId)) next.delete(wireId)
      else next.add(wireId)
      return next
    })
  }

  const monitoredWires = wires.filter(w => monitored.has(w.id))

  function drawWaveform(history: (0 | 1)[], color: string, offsetY: number, rowHeight: number) {
    if (history.length === 0) return null
    const W = 280
    const pts = history.slice(-100)
    const step = W / Math.max(pts.length - 1, 1)
    const hi = offsetY + 4
    const lo = offsetY + rowHeight - 4
    let d = ''
    pts.forEach((v, i) => {
      const x = i * step
      const y = v === 1 ? hi : lo
      if (i === 0) {
        d += `M ${x} ${y}`
      } else {
        const prevY = pts[i - 1] === 1 ? hi : lo
        if (prevY !== y) d += ` L ${x} ${prevY} L ${x} ${y}`
        else d += ` L ${x} ${y}`
      }
    })
    return <path key={color} d={d} stroke={color} strokeWidth={1.5} fill="none" />
  }

  const rowH = 32
  const svgH = Math.max(60, monitoredWires.length * rowH + 10)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: pos.y,
        right: pos.x,
        zIndex: 100,
        width: 320,
        backgroundColor: '#0d1117',
        border: '1px solid #374151',
        borderRadius: 8,
        boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-gray-700 cursor-move select-none"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-gray-200 font-mono">Oscilloscope</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(m => !m)} className="text-gray-500 hover:text-white p-0.5">
            <Minus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="px-2 py-1 border-b border-gray-800 flex flex-wrap gap-1 max-h-16 overflow-y-auto">
            {wires.length === 0 && (
              <span className="text-xs text-gray-600">No wires to monitor</span>
            )}
            {wires.map((w, i) => (
              <button
                key={w.id}
                onClick={() => toggleMonitor(w.id)}
                className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${
                  monitored.has(w.id)
                    ? 'border-current opacity-100'
                    : 'border-gray-700 text-gray-500 opacity-50'
                }`}
                style={{ color: COLORS[i % COLORS.length] }}
              >
                W{i + 1}
              </button>
            ))}
          </div>

          <div className="p-2">
            <svg width={300} height={svgH} style={{ display: 'block', background: '#0a0c10', borderRadius: 4 }}>
              {monitoredWires.length === 0 && (
                <text x={150} y={30} textAnchor="middle" fill="#374151" fontSize={11}>Select wires above</text>
              )}
              {monitoredWires.map((w, i) => {
                const history = wireHistory[w.id] ?? [w.signal]
                const color = COLORS[wires.indexOf(w) % COLORS.length]
                const offsetY = i * rowH
                return (
                  <g key={w.id}>
                    <line x1={0} y1={offsetY + rowH} x2={300} y2={offsetY + rowH} stroke="#1e2433" strokeWidth={1} />
                    <text x={4} y={offsetY + rowH / 2 + 4} fill={color} fontSize={9} fontFamily="monospace">W{wires.indexOf(w) + 1}</text>
                    {drawWaveform(history, color, offsetY, rowH)}
                  </g>
                )
              })}
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
