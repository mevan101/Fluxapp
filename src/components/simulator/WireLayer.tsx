import { Wire } from '../../types/circuit'

interface WireLayerProps {
  wires: Wire[]
  width: number
  height: number
  tempWire?: { x1: number; y1: number; x2: number; y2: number } | null
  onWireClick?: (wireId: string) => void
}

function pathD(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return ''
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

export default function WireLayer({ wires, width, height, tempWire, onWireClick }: WireLayerProps) {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {wires.map(wire => {
        const color = wire.signal === 1 ? '#00d4ff' : '#374151'
        const d = pathD(wire.path)
        return (
          <g key={wire.id} style={{ pointerEvents: 'stroke' }} onClick={() => onWireClick?.(wire.id)}>
            <path
              d={d}
              stroke="transparent"
              strokeWidth={12}
              fill="none"
              style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
            />
            <path
              d={d}
              stroke={color}
              strokeWidth={2}
              fill="none"
              filter={wire.signal === 1 ? 'url(#glow)' : undefined}
              className={wire.signal === 1 ? 'signal-flow' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )
      })}

      {tempWire && (
        <path
          d={`M ${tempWire.x1} ${tempWire.y1} L ${(tempWire.x1 + tempWire.x2) / 2} ${tempWire.y1} L ${(tempWire.x1 + tempWire.x2) / 2} ${tempWire.y2} L ${tempWire.x2} ${tempWire.y2}`}
          stroke="#00d4ff"
          strokeWidth={2}
          fill="none"
          strokeDasharray="6 4"
          opacity={0.7}
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
