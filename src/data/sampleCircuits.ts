import { Circuit } from '../types/circuit'

export const AND_GATE_DEMO: Circuit = {
  id: 'demo-and-gate',
  name: 'AND Gate Demo',
  viewport: { x: 0, y: 0, zoom: 1 },
  components: [
    {
      id: 'sw-a',
      type: 'SWITCH',
      x: 100,
      y: 100,
      width: 60,
      height: 40,
      label: 'Switch A',
      state: { value: 0 },
      pins: [
        { id: 'sw-a-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 },
      ],
    },
    {
      id: 'sw-b',
      type: 'SWITCH',
      x: 100,
      y: 200,
      width: 60,
      height: 40,
      label: 'Switch B',
      state: { value: 0 },
      pins: [
        { id: 'sw-b-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 },
      ],
    },
    {
      id: 'and-1',
      type: 'AND',
      x: 300,
      y: 130,
      width: 80,
      height: 60,
      label: 'AND',
      state: {},
      pins: [
        { id: 'and-1-a', name: 'A', type: 'input', position: { x: 0, y: 15 }, signal: 0 },
        { id: 'and-1-b', name: 'B', type: 'input', position: { x: 0, y: 45 }, signal: 0 },
        { id: 'and-1-y', name: 'Y', type: 'output', position: { x: 80, y: 30 }, signal: 0 },
      ],
    },
    {
      id: 'led-1',
      type: 'LED',
      x: 500,
      y: 150,
      width: 60,
      height: 60,
      label: 'LED',
      state: {},
      pins: [
        { id: 'led-1-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 },
      ],
    },
  ],
  wires: [
    {
      id: 'wire-swa-and',
      fromComponentId: 'sw-a',
      fromPinId: 'sw-a-out',
      toComponentId: 'and-1',
      toPinId: 'and-1-a',
      signal: 0,
      path: [
        { x: 160, y: 120 },
        { x: 240, y: 120 },
        { x: 240, y: 145 },
        { x: 300, y: 145 },
      ],
    },
    {
      id: 'wire-swb-and',
      fromComponentId: 'sw-b',
      fromPinId: 'sw-b-out',
      toComponentId: 'and-1',
      toPinId: 'and-1-b',
      signal: 0,
      path: [
        { x: 160, y: 220 },
        { x: 240, y: 220 },
        { x: 240, y: 175 },
        { x: 300, y: 175 },
      ],
    },
    {
      id: 'wire-and-led',
      fromComponentId: 'and-1',
      fromPinId: 'and-1-y',
      toComponentId: 'led-1',
      toPinId: 'led-1-a',
      signal: 0,
      path: [
        { x: 380, y: 160 },
        { x: 440, y: 160 },
        { x: 440, y: 180 },
        { x: 500, y: 180 },
      ],
    },
  ],
}

export const SAMPLE_CIRCUITS = [AND_GATE_DEMO]
