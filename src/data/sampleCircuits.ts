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

export const SR_LATCH_DEMO: Circuit = {
  id: 'demo-sr-latch',
  name: 'SR Latch (NOR)',
  viewport: { x: 0, y: 0, zoom: 1 },
  components: [
    {
      id: 'sw-s',
      type: 'SWITCH',
      x: 60,
      y: 80,
      width: 60,
      height: 40,
      label: 'Set',
      state: { value: 0 },
      pins: [{ id: 'sw-s-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'sw-r',
      type: 'SWITCH',
      x: 60,
      y: 260,
      width: 60,
      height: 40,
      label: 'Reset',
      state: { value: 0 },
      pins: [{ id: 'sw-r-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'nor-1',
      type: 'NOR',
      x: 220,
      y: 80,
      width: 80,
      height: 60,
      label: 'NOR Q',
      state: {},
      pins: [
        { id: 'nor1-a', name: 'A', type: 'input', position: { x: 0, y: 15 }, signal: 0 },
        { id: 'nor1-b', name: 'B', type: 'input', position: { x: 0, y: 45 }, signal: 0 },
        { id: 'nor1-y', name: 'Y', type: 'output', position: { x: 80, y: 30 }, signal: 0 },
      ],
    },
    {
      id: 'nor-2',
      type: 'NOR',
      x: 220,
      y: 240,
      width: 80,
      height: 60,
      label: 'NOR QB',
      state: {},
      pins: [
        { id: 'nor2-a', name: 'A', type: 'input', position: { x: 0, y: 15 }, signal: 0 },
        { id: 'nor2-b', name: 'B', type: 'input', position: { x: 0, y: 45 }, signal: 0 },
        { id: 'nor2-y', name: 'Y', type: 'output', position: { x: 80, y: 30 }, signal: 0 },
      ],
    },
    {
      id: 'led-q',
      type: 'LED',
      x: 440,
      y: 90,
      width: 60,
      height: 60,
      label: 'Q',
      state: {},
      pins: [{ id: 'led-q-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-qb',
      type: 'LED',
      x: 440,
      y: 250,
      width: 60,
      height: 60,
      label: 'QB',
      state: {},
      pins: [{ id: 'led-qb-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
  ],
  wires: [
    // S → NOR1.A
    { id: 'w-s-n1', fromComponentId: 'sw-s', fromPinId: 'sw-s-out', toComponentId: 'nor-1', toPinId: 'nor1-a', signal: 0, path: [{ x: 120, y: 100 }, { x: 180, y: 100 }, { x: 180, y: 95 }, { x: 220, y: 95 }] },
    // R → NOR2.B
    { id: 'w-r-n2', fromComponentId: 'sw-r', fromPinId: 'sw-r-out', toComponentId: 'nor-2', toPinId: 'nor2-b', signal: 0, path: [{ x: 120, y: 280 }, { x: 180, y: 280 }, { x: 180, y: 285 }, { x: 220, y: 285 }] },
    // NOR1.Y → LED Q
    { id: 'w-n1-q', fromComponentId: 'nor-1', fromPinId: 'nor1-y', toComponentId: 'led-q', toPinId: 'led-q-a', signal: 0, path: [{ x: 300, y: 110 }, { x: 380, y: 110 }, { x: 380, y: 120 }, { x: 440, y: 120 }] },
    // NOR2.Y → LED QB
    { id: 'w-n2-qb', fromComponentId: 'nor-2', fromPinId: 'nor2-y', toComponentId: 'led-qb', toPinId: 'led-qb-a', signal: 0, path: [{ x: 300, y: 270 }, { x: 380, y: 270 }, { x: 380, y: 280 }, { x: 440, y: 280 }] },
    // NOR1.Y feedback → NOR2.A (cross-couple)
    { id: 'w-n1-n2', fromComponentId: 'nor-1', fromPinId: 'nor1-y', toComponentId: 'nor-2', toPinId: 'nor2-a', signal: 0, path: [{ x: 300, y: 110 }, { x: 360, y: 110 }, { x: 360, y: 200 }, { x: 200, y: 200 }, { x: 200, y: 255 }, { x: 220, y: 255 }] },
    // NOR2.Y feedback → NOR1.B (cross-couple)
    { id: 'w-n2-n1', fromComponentId: 'nor-2', fromPinId: 'nor2-y', toComponentId: 'nor-1', toPinId: 'nor1-b', signal: 0, path: [{ x: 300, y: 270 }, { x: 340, y: 270 }, { x: 340, y: 180 }, { x: 190, y: 180 }, { x: 190, y: 125 }, { x: 220, y: 125 }] },
  ],
}

export const D_FLIP_FLOP_DEMO: Circuit = {
  id: 'demo-d-flipflop',
  name: 'D Flip-Flop Demo',
  viewport: { x: 0, y: 0, zoom: 1 },
  components: [
    {
      id: 'sw-d',
      type: 'SWITCH',
      x: 60,
      y: 100,
      width: 60,
      height: 40,
      label: 'D Input',
      state: { value: 0 },
      pins: [{ id: 'sw-d-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'clk-1',
      type: 'CLOCK',
      x: 60,
      y: 220,
      width: 60,
      height: 40,
      label: 'Clock',
      state: { value: 0 },
      pins: [{ id: 'clk-1-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'dff-1',
      type: 'D_FLIP_FLOP',
      x: 240,
      y: 120,
      width: 80,
      height: 80,
      label: 'D-FF',
      state: { q: 0, prevClk: 0 },
      pins: [
        { id: 'dff-d', name: 'D', type: 'input', position: { x: 0, y: 20 }, signal: 0 },
        { id: 'dff-clk', name: 'CLK', type: 'input', position: { x: 0, y: 60 }, signal: 0 },
        { id: 'dff-q', name: 'Q', type: 'output', position: { x: 80, y: 20 }, signal: 0 },
        { id: 'dff-qb', name: 'QB', type: 'output', position: { x: 80, y: 60 }, signal: 0 },
      ],
    },
    {
      id: 'led-q',
      type: 'LED',
      x: 440,
      y: 110,
      width: 60,
      height: 60,
      label: 'Q',
      state: {},
      pins: [{ id: 'led-q-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-qb',
      type: 'LED',
      x: 440,
      y: 210,
      width: 60,
      height: 60,
      label: 'QB',
      state: {},
      pins: [{ id: 'led-qb-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
  ],
  wires: [
    { id: 'w-d', fromComponentId: 'sw-d', fromPinId: 'sw-d-out', toComponentId: 'dff-1', toPinId: 'dff-d', signal: 0, path: [{ x: 120, y: 120 }, { x: 200, y: 120 }, { x: 200, y: 140 }, { x: 240, y: 140 }] },
    { id: 'w-clk', fromComponentId: 'clk-1', fromPinId: 'clk-1-out', toComponentId: 'dff-1', toPinId: 'dff-clk', signal: 0, path: [{ x: 120, y: 240 }, { x: 200, y: 240 }, { x: 200, y: 180 }, { x: 240, y: 180 }] },
    { id: 'w-q', fromComponentId: 'dff-1', fromPinId: 'dff-q', toComponentId: 'led-q', toPinId: 'led-q-a', signal: 0, path: [{ x: 320, y: 140 }, { x: 400, y: 140 }, { x: 400, y: 140 }, { x: 440, y: 140 }] },
    { id: 'w-qb', fromComponentId: 'dff-1', fromPinId: 'dff-qb', toComponentId: 'led-qb', toPinId: 'led-qb-a', signal: 0, path: [{ x: 320, y: 180 }, { x: 400, y: 180 }, { x: 400, y: 240 }, { x: 440, y: 240 }] },
  ],
}

export const HALF_ADDER_DEMO: Circuit = {
  id: 'demo-half-adder',
  name: 'Half Adder',
  viewport: { x: 0, y: 0, zoom: 1 },
  components: [
    {
      id: 'sw-a',
      type: 'SWITCH',
      x: 60,
      y: 80,
      width: 60,
      height: 40,
      label: 'A',
      state: { value: 0 },
      pins: [{ id: 'sw-a-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'sw-b',
      type: 'SWITCH',
      x: 60,
      y: 200,
      width: 60,
      height: 40,
      label: 'B',
      state: { value: 0 },
      pins: [{ id: 'sw-b-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'ha-1',
      type: 'HALF_ADDER',
      x: 240,
      y: 110,
      width: 80,
      height: 80,
      label: 'Half Adder',
      state: {},
      pins: [
        { id: 'ha-a', name: 'A', type: 'input', position: { x: 0, y: 20 }, signal: 0 },
        { id: 'ha-b', name: 'B', type: 'input', position: { x: 0, y: 60 }, signal: 0 },
        { id: 'ha-sum', name: 'Sum', type: 'output', position: { x: 80, y: 20 }, signal: 0 },
        { id: 'ha-carry', name: 'Carry', type: 'output', position: { x: 80, y: 60 }, signal: 0 },
      ],
    },
    {
      id: 'led-sum',
      type: 'LED',
      x: 440,
      y: 110,
      width: 60,
      height: 60,
      label: 'Sum',
      state: {},
      pins: [{ id: 'led-sum-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-carry',
      type: 'LED',
      x: 440,
      y: 210,
      width: 60,
      height: 60,
      label: 'Carry',
      state: {},
      pins: [{ id: 'led-carry-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
  ],
  wires: [
    { id: 'w-a', fromComponentId: 'sw-a', fromPinId: 'sw-a-out', toComponentId: 'ha-1', toPinId: 'ha-a', signal: 0, path: [{ x: 120, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 130 }, { x: 240, y: 130 }] },
    { id: 'w-b', fromComponentId: 'sw-b', fromPinId: 'sw-b-out', toComponentId: 'ha-1', toPinId: 'ha-b', signal: 0, path: [{ x: 120, y: 220 }, { x: 200, y: 220 }, { x: 200, y: 170 }, { x: 240, y: 170 }] },
    { id: 'w-sum', fromComponentId: 'ha-1', fromPinId: 'ha-sum', toComponentId: 'led-sum', toPinId: 'led-sum-a', signal: 0, path: [{ x: 320, y: 130 }, { x: 400, y: 130 }, { x: 400, y: 140 }, { x: 440, y: 140 }] },
    { id: 'w-carry', fromComponentId: 'ha-1', fromPinId: 'ha-carry', toComponentId: 'led-carry', toPinId: 'led-carry-a', signal: 0, path: [{ x: 320, y: 170 }, { x: 400, y: 170 }, { x: 400, y: 240 }, { x: 440, y: 240 }] },
  ],
}

export const XOR_GATE_DEMO: Circuit = {
  id: 'demo-xor-gate',
  name: 'XOR Gate Demo',
  viewport: { x: 0, y: 0, zoom: 1 },
  components: [
    {
      id: 'sw-a',
      type: 'SWITCH',
      x: 80,
      y: 100,
      width: 60,
      height: 40,
      label: 'A',
      state: { value: 0 },
      pins: [{ id: 'sw-a-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'sw-b',
      type: 'SWITCH',
      x: 80,
      y: 200,
      width: 60,
      height: 40,
      label: 'B',
      state: { value: 0 },
      pins: [{ id: 'sw-b-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'xor-1',
      type: 'XOR',
      x: 280,
      y: 130,
      width: 80,
      height: 60,
      label: 'XOR',
      state: {},
      pins: [
        { id: 'xor-a', name: 'A', type: 'input', position: { x: 0, y: 15 }, signal: 0 },
        { id: 'xor-b', name: 'B', type: 'input', position: { x: 0, y: 45 }, signal: 0 },
        { id: 'xor-y', name: 'Y', type: 'output', position: { x: 80, y: 30 }, signal: 0 },
      ],
    },
    {
      id: 'led-1',
      type: 'LED',
      x: 480,
      y: 140,
      width: 60,
      height: 60,
      label: 'LED',
      state: {},
      pins: [{ id: 'led-1-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
  ],
  wires: [
    { id: 'w-a', fromComponentId: 'sw-a', fromPinId: 'sw-a-out', toComponentId: 'xor-1', toPinId: 'xor-a', signal: 0, path: [{ x: 140, y: 120 }, { x: 220, y: 120 }, { x: 220, y: 145 }, { x: 280, y: 145 }] },
    { id: 'w-b', fromComponentId: 'sw-b', fromPinId: 'sw-b-out', toComponentId: 'xor-1', toPinId: 'xor-b', signal: 0, path: [{ x: 140, y: 220 }, { x: 220, y: 220 }, { x: 220, y: 175 }, { x: 280, y: 175 }] },
    { id: 'w-y', fromComponentId: 'xor-1', fromPinId: 'xor-y', toComponentId: 'led-1', toPinId: 'led-1-a', signal: 0, path: [{ x: 360, y: 160 }, { x: 440, y: 160 }, { x: 440, y: 170 }, { x: 480, y: 170 }] },
  ],
}

export const SAMPLE_CIRCUITS = [AND_GATE_DEMO, XOR_GATE_DEMO, HALF_ADDER_DEMO, SR_LATCH_DEMO, D_FLIP_FLOP_DEMO]


// COUNTER_DEMO: 4 T flip-flops as a ripple counter
export const COUNTER_DEMO: Circuit = {
  id: 'demo-counter',
  name: '4-bit Ripple Counter',
  viewport: { x: 0, y: 0, zoom: 1 },
  components: [
    {
      id: 'clk-cnt',
      type: 'CLOCK',
      x: 40, y: 160, width: 60, height: 40, label: 'Clock',
      state: { value: 0 },
      pins: [{ id: 'clk-cnt-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'tff0',
      type: 'T_FLIP_FLOP',
      x: 160, y: 120, width: 80, height: 80, label: 'T-FF Q0',
      state: { q: 0, prevClk: 0 },
      pins: [
        { id: 'tff0-t', name: 'T', type: 'input', position: { x: 0, y: 20 }, signal: 0 },
        { id: 'tff0-clk', name: 'CLK', type: 'input', position: { x: 0, y: 60 }, signal: 0 },
        { id: 'tff0-q', name: 'Q', type: 'output', position: { x: 80, y: 20 }, signal: 0 },
        { id: 'tff0-qb', name: 'QB', type: 'output', position: { x: 80, y: 60 }, signal: 0 },
      ],
    },
    {
      id: 'tff1',
      type: 'T_FLIP_FLOP',
      x: 300, y: 120, width: 80, height: 80, label: 'T-FF Q1',
      state: { q: 0, prevClk: 0 },
      pins: [
        { id: 'tff1-t', name: 'T', type: 'input', position: { x: 0, y: 20 }, signal: 0 },
        { id: 'tff1-clk', name: 'CLK', type: 'input', position: { x: 0, y: 60 }, signal: 0 },
        { id: 'tff1-q', name: 'Q', type: 'output', position: { x: 80, y: 20 }, signal: 0 },
        { id: 'tff1-qb', name: 'QB', type: 'output', position: { x: 80, y: 60 }, signal: 0 },
      ],
    },
    {
      id: 'tff2',
      type: 'T_FLIP_FLOP',
      x: 440, y: 120, width: 80, height: 80, label: 'T-FF Q2',
      state: { q: 0, prevClk: 0 },
      pins: [
        { id: 'tff2-t', name: 'T', type: 'input', position: { x: 0, y: 20 }, signal: 0 },
        { id: 'tff2-clk', name: 'CLK', type: 'input', position: { x: 0, y: 60 }, signal: 0 },
        { id: 'tff2-q', name: 'Q', type: 'output', position: { x: 80, y: 20 }, signal: 0 },
        { id: 'tff2-qb', name: 'QB', type: 'output', position: { x: 80, y: 60 }, signal: 0 },
      ],
    },
    {
      id: 'tff3',
      type: 'T_FLIP_FLOP',
      x: 580, y: 120, width: 80, height: 80, label: 'T-FF Q3',
      state: { q: 0, prevClk: 0 },
      pins: [
        { id: 'tff3-t', name: 'T', type: 'input', position: { x: 0, y: 20 }, signal: 0 },
        { id: 'tff3-clk', name: 'CLK', type: 'input', position: { x: 0, y: 60 }, signal: 0 },
        { id: 'tff3-q', name: 'Q', type: 'output', position: { x: 80, y: 20 }, signal: 0 },
        { id: 'tff3-qb', name: 'QB', type: 'output', position: { x: 80, y: 60 }, signal: 0 },
      ],
    },
    {
      id: 'vcc-cnt',
      type: 'VCC',
      x: 160, y: 40, width: 40, height: 40, label: 'VCC',
      state: {},
      pins: [{ id: 'vcc-cnt-out', name: 'Y', type: 'output', position: { x: 20, y: 40 }, signal: 0 }],
    },
    {
      id: 'led-q0', type: 'LED', x: 160, y: 260, width: 60, height: 60, label: 'Q0', state: {},
      pins: [{ id: 'led-q0-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-q1', type: 'LED', x: 300, y: 260, width: 60, height: 60, label: 'Q1', state: {},
      pins: [{ id: 'led-q1-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-q2', type: 'LED', x: 440, y: 260, width: 60, height: 60, label: 'Q2', state: {},
      pins: [{ id: 'led-q2-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-q3', type: 'LED', x: 580, y: 260, width: 60, height: 60, label: 'Q3', state: {},
      pins: [{ id: 'led-q3-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
  ],
  wires: [
    // VCC → T of all flip-flops (T=1 always → toggle on every edge)
    { id: 'w-vcc-t0', fromComponentId: 'vcc-cnt', fromPinId: 'vcc-cnt-out', toComponentId: 'tff0', toPinId: 'tff0-t', signal: 0, path: [{ x: 180, y: 80 }, { x: 180, y: 100 }, { x: 160, y: 100 }, { x: 160, y: 140 }] },
    // CLK → TFF0 clk
    { id: 'w-clk-t0', fromComponentId: 'clk-cnt', fromPinId: 'clk-cnt-out', toComponentId: 'tff0', toPinId: 'tff0-clk', signal: 0, path: [{ x: 100, y: 180 }, { x: 140, y: 180 }, { x: 140, y: 180 }, { x: 160, y: 180 }] },
    // TFF0.Q → TFF1 CLK (ripple)
    { id: 'w-q0-t1clk', fromComponentId: 'tff0', fromPinId: 'tff0-q', toComponentId: 'tff1', toPinId: 'tff1-clk', signal: 0, path: [{ x: 240, y: 140 }, { x: 270, y: 140 }, { x: 270, y: 180 }, { x: 300, y: 180 }] },
    // TFF1.Q → TFF2 CLK
    { id: 'w-q1-t2clk', fromComponentId: 'tff1', fromPinId: 'tff1-q', toComponentId: 'tff2', toPinId: 'tff2-clk', signal: 0, path: [{ x: 380, y: 140 }, { x: 410, y: 140 }, { x: 410, y: 180 }, { x: 440, y: 180 }] },
    // TFF2.Q → TFF3 CLK
    { id: 'w-q2-t3clk', fromComponentId: 'tff2', fromPinId: 'tff2-q', toComponentId: 'tff3', toPinId: 'tff3-clk', signal: 0, path: [{ x: 520, y: 140 }, { x: 550, y: 140 }, { x: 550, y: 180 }, { x: 580, y: 180 }] },
    // VCC → T1, T2, T3
    { id: 'w-vcc-t1', fromComponentId: 'vcc-cnt', fromPinId: 'vcc-cnt-out', toComponentId: 'tff1', toPinId: 'tff1-t', signal: 0, path: [{ x: 180, y: 80 }, { x: 300, y: 80 }, { x: 300, y: 120 }, { x: 300, y: 140 }] },
    { id: 'w-vcc-t2', fromComponentId: 'vcc-cnt', fromPinId: 'vcc-cnt-out', toComponentId: 'tff2', toPinId: 'tff2-t', signal: 0, path: [{ x: 180, y: 80 }, { x: 440, y: 80 }, { x: 440, y: 140 }] },
    { id: 'w-vcc-t3', fromComponentId: 'vcc-cnt', fromPinId: 'vcc-cnt-out', toComponentId: 'tff3', toPinId: 'tff3-t', signal: 0, path: [{ x: 180, y: 80 }, { x: 580, y: 80 }, { x: 580, y: 140 }] },
    // Q outputs → LEDs
    { id: 'w-q0-led', fromComponentId: 'tff0', fromPinId: 'tff0-q', toComponentId: 'led-q0', toPinId: 'led-q0-a', signal: 0, path: [{ x: 240, y: 140 }, { x: 250, y: 140 }, { x: 250, y: 250 }, { x: 220, y: 250 }, { x: 160, y: 250 }, { x: 160, y: 290 }] },
    { id: 'w-q1-led', fromComponentId: 'tff1', fromPinId: 'tff1-q', toComponentId: 'led-q1', toPinId: 'led-q1-a', signal: 0, path: [{ x: 380, y: 140 }, { x: 390, y: 140 }, { x: 390, y: 250 }, { x: 360, y: 250 }, { x: 300, y: 250 }, { x: 300, y: 290 }] },
    { id: 'w-q2-led', fromComponentId: 'tff2', fromPinId: 'tff2-q', toComponentId: 'led-q2', toPinId: 'led-q2-a', signal: 0, path: [{ x: 520, y: 140 }, { x: 530, y: 140 }, { x: 530, y: 250 }, { x: 500, y: 250 }, { x: 440, y: 250 }, { x: 440, y: 290 }] },
    { id: 'w-q3-led', fromComponentId: 'tff3', fromPinId: 'tff3-q', toComponentId: 'led-q3', toPinId: 'led-q3-a', signal: 0, path: [{ x: 660, y: 140 }, { x: 670, y: 140 }, { x: 670, y: 250 }, { x: 640, y: 250 }, { x: 580, y: 250 }, { x: 580, y: 290 }] },
  ],
}

// DECODER_DEMO: 2 switches → 2:4 decoder → 4 LEDs
export const DECODER_DEMO: Circuit = {
  id: 'demo-decoder',
  name: '2:4 Decoder Demo',
  viewport: { x: 0, y: 0, zoom: 1 },
  components: [
    {
      id: 'sw-da', type: 'SWITCH', x: 60, y: 100, width: 60, height: 40, label: 'A',
      state: { value: 0 },
      pins: [{ id: 'sw-da-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'sw-db', type: 'SWITCH', x: 60, y: 220, width: 60, height: 40, label: 'B',
      state: { value: 0 },
      pins: [{ id: 'sw-db-out', name: 'Y', type: 'output', position: { x: 60, y: 20 }, signal: 0 }],
    },
    {
      id: 'dec-1', type: 'DECODER_2_4', x: 240, y: 120, width: 80, height: 100, label: '2:4 Dec',
      state: {},
      pins: [
        { id: 'dec-a', name: 'A', type: 'input', position: { x: 0, y: 25 }, signal: 0 },
        { id: 'dec-b', name: 'B', type: 'input', position: { x: 0, y: 75 }, signal: 0 },
        { id: 'dec-y0', name: 'Y0', type: 'output', position: { x: 80, y: 12 }, signal: 0 },
        { id: 'dec-y1', name: 'Y1', type: 'output', position: { x: 80, y: 37 }, signal: 0 },
        { id: 'dec-y2', name: 'Y2', type: 'output', position: { x: 80, y: 62 }, signal: 0 },
        { id: 'dec-y3', name: 'Y3', type: 'output', position: { x: 80, y: 87 }, signal: 0 },
      ],
    },
    {
      id: 'led-d0', type: 'LED', x: 440, y: 80, width: 60, height: 60, label: 'Y0(AB=00)', state: {},
      pins: [{ id: 'led-d0-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-d1', type: 'LED', x: 440, y: 160, width: 60, height: 60, label: 'Y1(AB=01)', state: {},
      pins: [{ id: 'led-d1-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-d2', type: 'LED', x: 440, y: 240, width: 60, height: 60, label: 'Y2(AB=10)', state: {},
      pins: [{ id: 'led-d2-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
    {
      id: 'led-d3', type: 'LED', x: 440, y: 320, width: 60, height: 60, label: 'Y3(AB=11)', state: {},
      pins: [{ id: 'led-d3-a', name: 'A', type: 'input', position: { x: 0, y: 30 }, signal: 0 }],
    },
  ],
  wires: [
    { id: 'w-da-dec', fromComponentId: 'sw-da', fromPinId: 'sw-da-out', toComponentId: 'dec-1', toPinId: 'dec-a', signal: 0, path: [{ x: 120, y: 120 }, { x: 200, y: 120 }, { x: 200, y: 145 }, { x: 240, y: 145 }] },
    { id: 'w-db-dec', fromComponentId: 'sw-db', fromPinId: 'sw-db-out', toComponentId: 'dec-1', toPinId: 'dec-b', signal: 0, path: [{ x: 120, y: 240 }, { x: 200, y: 240 }, { x: 200, y: 195 }, { x: 240, y: 195 }] },
    { id: 'w-y0-led', fromComponentId: 'dec-1', fromPinId: 'dec-y0', toComponentId: 'led-d0', toPinId: 'led-d0-a', signal: 0, path: [{ x: 320, y: 132 }, { x: 400, y: 132 }, { x: 400, y: 110 }, { x: 440, y: 110 }] },
    { id: 'w-y1-led', fromComponentId: 'dec-1', fromPinId: 'dec-y1', toComponentId: 'led-d1', toPinId: 'led-d1-a', signal: 0, path: [{ x: 320, y: 157 }, { x: 400, y: 157 }, { x: 400, y: 190 }, { x: 440, y: 190 }] },
    { id: 'w-y2-led', fromComponentId: 'dec-1', fromPinId: 'dec-y2', toComponentId: 'led-d2', toPinId: 'led-d2-a', signal: 0, path: [{ x: 320, y: 182 }, { x: 400, y: 182 }, { x: 400, y: 270 }, { x: 440, y: 270 }] },
    { id: 'w-y3-led', fromComponentId: 'dec-1', fromPinId: 'dec-y3', toComponentId: 'led-d3', toPinId: 'led-d3-a', signal: 0, path: [{ x: 320, y: 207 }, { x: 400, y: 207 }, { x: 400, y: 350 }, { x: 440, y: 350 }] },
  ],
}
