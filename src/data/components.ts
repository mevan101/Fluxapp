import { ComponentType, CircuitComponent, Pin } from '../types/circuit'

export interface ComponentTemplate {
  type: ComponentType
  label: string
  width: number
  height: number
  category: 'power' | 'logic' | 'memory' | 'io' | 'complex'
  pins: Omit<Pin, 'id' | 'signal'>[]
}

function makePins(defs: Omit<Pin, 'id' | 'signal'>[]): Omit<Pin, 'id' | 'signal'>[] {
  return defs
}

export const COMPONENT_TEMPLATES: Record<ComponentType, ComponentTemplate> = {
  AND: {
    type: 'AND', label: 'AND', width: 80, height: 60, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 45 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 30 } },
    ]),
  },
  OR: {
    type: 'OR', label: 'OR', width: 80, height: 60, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 45 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 30 } },
    ]),
  },
  NOT: {
    type: 'NOT', label: 'NOT', width: 60, height: 40, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 20 } },
      { name: 'Y', type: 'output', position: { x: 60, y: 20 } },
    ]),
  },
  XOR: {
    type: 'XOR', label: 'XOR', width: 80, height: 60, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 45 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 30 } },
    ]),
  },
  NAND: {
    type: 'NAND', label: 'NAND', width: 80, height: 60, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 45 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 30 } },
    ]),
  },
  NOR: {
    type: 'NOR', label: 'NOR', width: 80, height: 60, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 45 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 30 } },
    ]),
  },
  D_FLIP_FLOP: {
    type: 'D_FLIP_FLOP', label: 'D-FF', width: 80, height: 80, category: 'memory',
    pins: makePins([
      { name: 'D', type: 'input', position: { x: 0, y: 20 } },
      { name: 'CLK', type: 'input', position: { x: 0, y: 60 } },
      { name: 'Q', type: 'output', position: { x: 80, y: 20 } },
      { name: 'QB', type: 'output', position: { x: 80, y: 60 } },
    ]),
  },
  JK_FLIP_FLOP: {
    type: 'JK_FLIP_FLOP', label: 'JK-FF', width: 80, height: 80, category: 'memory',
    pins: makePins([
      { name: 'J', type: 'input', position: { x: 0, y: 20 } },
      { name: 'K', type: 'input', position: { x: 0, y: 40 } },
      { name: 'CLK', type: 'input', position: { x: 0, y: 60 } },
      { name: 'Q', type: 'output', position: { x: 80, y: 20 } },
      { name: 'QB', type: 'output', position: { x: 80, y: 60 } },
    ]),
  },
  MUX: {
    type: 'MUX', label: 'MUX 2:1', width: 80, height: 80, category: 'complex',
    pins: makePins([
      { name: 'I0', type: 'input', position: { x: 0, y: 20 } },
      { name: 'I1', type: 'input', position: { x: 0, y: 40 } },
      { name: 'S', type: 'input', position: { x: 0, y: 60 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 40 } },
    ]),
  },
  LED: {
    type: 'LED', label: 'LED', width: 60, height: 60, category: 'io',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 30 } },
    ]),
  },
  SWITCH: {
    type: 'SWITCH', label: 'Switch', width: 60, height: 40, category: 'io',
    pins: makePins([
      { name: 'Y', type: 'output', position: { x: 60, y: 20 } },
    ]),
  },
  CLOCK: {
    type: 'CLOCK', label: 'Clock', width: 60, height: 40, category: 'io',
    pins: makePins([
      { name: 'Y', type: 'output', position: { x: 60, y: 20 } },
    ]),
  },
  VCC: {
    type: 'VCC', label: 'VCC', width: 40, height: 40, category: 'power',
    pins: makePins([
      { name: 'Y', type: 'output', position: { x: 20, y: 40 } },
    ]),
  },
  GND: {
    type: 'GND', label: 'GND', width: 40, height: 40, category: 'power',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 20, y: 0 } },
    ]),
  },
  SEVEN_SEG: {
    type: 'SEVEN_SEG', label: '7-Seg', width: 80, height: 100, category: 'complex',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 14 } },
      { name: 'B', type: 'input', position: { x: 0, y: 28 } },
      { name: 'C', type: 'input', position: { x: 0, y: 42 } },
      { name: 'D', type: 'input', position: { x: 0, y: 56 } },
      { name: 'E', type: 'input', position: { x: 0, y: 70 } },
      { name: 'F', type: 'input', position: { x: 0, y: 84 } },
      { name: 'G', type: 'input', position: { x: 0, y: 98 } },
    ]),
  },
  HALF_ADDER: {
    type: 'HALF_ADDER', label: 'Half Adder', width: 80, height: 80, category: 'complex',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 20 } },
      { name: 'B', type: 'input', position: { x: 0, y: 60 } },
      { name: 'Sum', type: 'output', position: { x: 80, y: 20 } },
      { name: 'Carry', type: 'output', position: { x: 80, y: 60 } },
    ]),
  },
  FULL_ADDER: {
    type: 'FULL_ADDER', label: 'Full Adder', width: 80, height: 80, category: 'complex',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 40 } },
      { name: 'Cin', type: 'input', position: { x: 0, y: 65 } },
      { name: 'Sum', type: 'output', position: { x: 80, y: 25 } },
      { name: 'Cout', type: 'output', position: { x: 80, y: 55 } },
    ]),
  },
  XNOR: {
    type: 'XNOR', label: 'XNOR', width: 80, height: 60, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 45 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 30 } },
    ]),
  },
  BUFFER: {
    type: 'BUFFER', label: 'Buffer', width: 60, height: 40, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 20 } },
      { name: 'Y', type: 'output', position: { x: 60, y: 20 } },
    ]),
  },
  AND3: {
    type: 'AND3', label: 'AND3', width: 80, height: 80, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 40 } },
      { name: 'C', type: 'input', position: { x: 0, y: 65 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 40 } },
    ]),
  },
  OR3: {
    type: 'OR3', label: 'OR3', width: 80, height: 80, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 40 } },
      { name: 'C', type: 'input', position: { x: 0, y: 65 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 40 } },
    ]),
  },
  NAND3: {
    type: 'NAND3', label: 'NAND3', width: 80, height: 80, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 40 } },
      { name: 'C', type: 'input', position: { x: 0, y: 65 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 40 } },
    ]),
  },
  NOR3: {
    type: 'NOR3', label: 'NOR3', width: 80, height: 80, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 40 } },
      { name: 'C', type: 'input', position: { x: 0, y: 65 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 40 } },
    ]),
  },
  XOR3: {
    type: 'XOR3', label: 'XOR3', width: 80, height: 80, category: 'logic',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 15 } },
      { name: 'B', type: 'input', position: { x: 0, y: 40 } },
      { name: 'C', type: 'input', position: { x: 0, y: 65 } },
      { name: 'Y', type: 'output', position: { x: 80, y: 40 } },
    ]),
  },
  T_FLIP_FLOP: {
    type: 'T_FLIP_FLOP', label: 'T-FF', width: 80, height: 80, category: 'memory',
    pins: makePins([
      { name: 'T', type: 'input', position: { x: 0, y: 20 } },
      { name: 'CLK', type: 'input', position: { x: 0, y: 60 } },
      { name: 'Q', type: 'output', position: { x: 80, y: 20 } },
      { name: 'QB', type: 'output', position: { x: 80, y: 60 } },
    ]),
  },
  SR_LATCH: {
    type: 'SR_LATCH', label: 'SR Latch', width: 80, height: 80, category: 'memory',
    pins: makePins([
      { name: 'S', type: 'input', position: { x: 0, y: 20 } },
      { name: 'R', type: 'input', position: { x: 0, y: 60 } },
      { name: 'Q', type: 'output', position: { x: 80, y: 20 } },
      { name: 'QB', type: 'output', position: { x: 80, y: 60 } },
    ]),
  },
  DECODER_2_4: {
    type: 'DECODER_2_4', label: '2:4 Dec', width: 80, height: 100, category: 'complex',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 25 } },
      { name: 'B', type: 'input', position: { x: 0, y: 75 } },
      { name: 'Y0', type: 'output', position: { x: 80, y: 12 } },
      { name: 'Y1', type: 'output', position: { x: 80, y: 37 } },
      { name: 'Y2', type: 'output', position: { x: 80, y: 62 } },
      { name: 'Y3', type: 'output', position: { x: 80, y: 87 } },
    ]),
  },
  DEMUX: {
    type: 'DEMUX', label: '1:2 Demux', width: 80, height: 80, category: 'complex',
    pins: makePins([
      { name: 'I', type: 'input', position: { x: 0, y: 20 } },
      { name: 'S', type: 'input', position: { x: 0, y: 60 } },
      { name: 'Y0', type: 'output', position: { x: 80, y: 20 } },
      { name: 'Y1', type: 'output', position: { x: 80, y: 60 } },
    ]),
  },
  PROBE: {
    type: 'PROBE', label: 'Probe', width: 60, height: 50, category: 'io',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 25 } },
    ]),
  },
  BUZZER: {
    type: 'BUZZER', label: 'Buzzer', width: 60, height: 60, category: 'io',
    pins: makePins([
      { name: 'A', type: 'input', position: { x: 0, y: 30 } },
    ]),
  },
  TEXT_LABEL: {
    type: 'TEXT_LABEL', label: 'Label', width: 100, height: 40, category: 'io',
    pins: makePins([
      { name: 'dummy', type: 'input', position: { x: 0, y: 20 } },
    ]),
  },
  BREADBOARD: {
    type: 'BREADBOARD', label: 'Breadboard', width: 340, height: 340, category: 'complex',
    pins: makePins([
      { name: 'dummy', type: 'input', position: { x: 0, y: 170 } },
    ]),
  },
}

let _idCounter = 1
function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${_idCounter++}`
}

export function createComponent(type: ComponentType, x: number, y: number): CircuitComponent {
  const tmpl = COMPONENT_TEMPLATES[type]
  const pins: Pin[] = tmpl.pins.map(p => ({
    ...p,
    id: genId('pin'),
    signal: 0 as 0 | 1,
  }))
  let state: Record<string, unknown> = {}
  if (type === 'SWITCH' || type === 'CLOCK') state = { value: 0 }
  else if (type === 'D_FLIP_FLOP' || type === 'JK_FLIP_FLOP' || type === 'T_FLIP_FLOP') state = { q: 0, prevClk: 0 }
  else if (type === 'SR_LATCH') state = { q: 0 }
  return {
    id: genId('comp'),
    type,
    x,
    y,
    width: tmpl.width,
    height: tmpl.height,
    label: tmpl.label,
    pins,
    state,
  }
}
