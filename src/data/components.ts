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
  return {
    id: genId('comp'),
    type,
    x,
    y,
    width: tmpl.width,
    height: tmpl.height,
    label: tmpl.label,
    pins,
    state: type === 'SWITCH' ? { value: 0 } : type === 'CLOCK' ? { value: 0 } : type === 'D_FLIP_FLOP' ? { q: 0, prevClk: 0 } : type === 'JK_FLIP_FLOP' ? { q: 0, prevClk: 0 } : {},
  }
}
