export type ComponentType =
  | 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR'
  | 'D_FLIP_FLOP' | 'JK_FLIP_FLOP' | 'MUX'
  | 'LED' | 'SWITCH' | 'CLOCK' | 'VCC' | 'GND'
  | 'SEVEN_SEG' | 'HALF_ADDER' | 'FULL_ADDER'

export interface Pin {
  id: string
  name: string
  type: 'input' | 'output'
  position: { x: number; y: number }
  signal: 0 | 1
}

export interface CircuitComponent {
  id: string
  type: ComponentType
  x: number
  y: number
  width: number
  height: number
  label: string
  pins: Pin[]
  state: Record<string, unknown>
}

export interface Wire {
  id: string
  fromComponentId: string
  fromPinId: string
  toComponentId: string
  toPinId: string
  signal: 0 | 1
  path: { x: number; y: number }[]
}

export interface Circuit {
  id: string
  name: string
  components: CircuitComponent[]
  wires: Wire[]
  viewport: { x: number; y: number; zoom: number }
}
