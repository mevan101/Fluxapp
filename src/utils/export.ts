import { Circuit } from '../types/circuit'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Converts a Circuit object to an SVG string.
 * Produces a self-contained dark-theme SVG suitable for download or embedding.
 */
export function circuitToSvg(circuit: Circuit): string {
  const pad = 60

  // Bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const c of circuit.components) {
    minX = Math.min(minX, c.x)
    minY = Math.min(minY, c.y)
    maxX = Math.max(maxX, c.x + c.width)
    maxY = Math.max(maxY, c.y + c.height)
  }
  for (const w of circuit.wires) {
    for (const pt of w.path) {
      minX = Math.min(minX, pt.x)
      minY = Math.min(minY, pt.y)
      maxX = Math.max(maxX, pt.x)
      maxY = Math.max(maxY, pt.y)
    }
  }
  if (!isFinite(minX)) { minX = 0; minY = 0; maxX = 400; maxY = 300 }

  const ox = -minX + pad
  const oy = -minY + pad
  const svgW = maxX - minX + pad * 2
  const svgH = maxY - minY + pad * 2

  // Wires
  const wireParts = circuit.wires.map(wire => {
    if (wire.path.length < 2) return ''
    const color = wire.signal === 1 ? '#00d4ff' : '#374151'
    const glowAttr = wire.signal === 1 ? ' filter="url(#glow)"' : ''
    let d = `M ${wire.path[0].x + ox} ${wire.path[0].y + oy}`
    for (let i = 1; i < wire.path.length; i++) {
      d += ` L ${wire.path[i].x + ox} ${wire.path[i].y + oy}`
    }
    return `<path d="${d}" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"${glowAttr}/>`
  })

  // Components
  const SYMBOLS: Record<string, string> = {
    AND: '&amp;', OR: '&#8805;1', NOT: '1', XOR: '=1', NAND: '&amp;&#773;', NOR: '&#8805;1&#773;',
    D_FLIP_FLOP: 'DFF', JK_FLIP_FLOP: 'JK-FF',
    MUX: 'MUX', HALF_ADDER: 'HA', FULL_ADDER: 'FA',
    LED: 'LED', SWITCH: 'SW', CLOCK: 'CLK', VCC: 'VCC', GND: 'GND', SEVEN_SEG: '7-SEG',
  }
  const TYPE_COLORS: Record<string, string> = {
    AND: '#00d4ff', OR: '#00d4ff', NOT: '#00d4ff', XOR: '#00d4ff', NAND: '#00d4ff', NOR: '#00d4ff',
    LED: '#10b981', SWITCH: '#10b981', CLOCK: '#10b981',
    VCC: '#fbbf24', GND: '#fbbf24',
    D_FLIP_FLOP: '#a78bfa', JK_FLIP_FLOP: '#a78bfa',
    MUX: '#fb923c', SEVEN_SEG: '#fb923c', HALF_ADDER: '#fb923c', FULL_ADDER: '#fb923c',
  }

  const compParts = circuit.components.map(comp => {
    const cx = comp.x + ox
    const cy = comp.y + oy
    const color = TYPE_COLORS[comp.type] ?? '#9ca3af'
    const symbol = SYMBOLS[comp.type] ?? escapeXml(comp.type)
    const pinDots = comp.pins.map(pin => {
      const px = cx + pin.position.x
      const py = cy + pin.position.y
      const pinColor = pin.signal === 1 ? '#00d4ff' : pin.type === 'output' ? '#4b5563' : '#374151'
      const glowAttr = pin.signal === 1 ? ' filter="url(#glow)"' : ''
      return `<circle cx="${px}" cy="${py}" r="4" fill="${pinColor}" stroke="${pin.signal === 1 ? '#00d4ff' : '#1f2937'}" stroke-width="1.5"${glowAttr}/>`
    })

    return `
  <g>
    <rect x="${cx}" y="${cy}" width="${comp.width}" height="${comp.height}" rx="8"
          fill="#1a1f2e" stroke="${color}" stroke-width="1.5" opacity="0.9"/>
    <text x="${cx + comp.width / 2}" y="${cy + comp.height / 2 - 4}"
          text-anchor="middle" dominant-baseline="middle"
          fill="${color}" font-family="JetBrains Mono, Consolas, monospace"
          font-size="13" font-weight="bold">${symbol}</text>
    <text x="${cx + comp.width / 2}" y="${cy + comp.height - 10}"
          text-anchor="middle"
          fill="#6b7280" font-family="JetBrains Mono, Consolas, monospace"
          font-size="9">${escapeXml(comp.label)}</text>
    ${pinDots.join('\n    ')}
  </g>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="grid" x="${ox % 20}" y="${oy % 20}" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="0.8" fill="#1e2433"/>
    </pattern>
  </defs>
  <rect width="${svgW}" height="${svgH}" fill="#0a0c10"/>
  <rect width="${svgW}" height="${svgH}" fill="url(#grid)" opacity="0.8"/>
  ${wireParts.join('\n  ')}
  ${compParts.join('\n  ')}
  <text x="${svgW - 8}" y="${svgH - 6}" text-anchor="end"
        fill="#374151" font-family="monospace" font-size="9">&#9889; FLUX Circuit Simulator</text>
</svg>`
}

/**
 * Downloads the circuit as an SVG file.
 */
export function downloadCircuitSvg(circuit: Circuit, name: string): void {
  const svg = circuitToSvg(circuit)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name.replace(/\s+/g, '_') || 'circuit'}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Downloads the circuit as a JSON file.
 */
export function downloadCircuitJson(circuit: Circuit, name: string): void {
  const data = JSON.stringify({ ...circuit, name }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name.replace(/\s+/g, '_') || 'circuit'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
