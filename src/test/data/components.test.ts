import { describe, it, expect, beforeEach } from 'vitest'
import { COMPONENT_TEMPLATES, createComponent } from '../../data/components'
import { ComponentType } from '../../types/circuit'

describe('COMPONENT_TEMPLATES', () => {
  it('contains all expected component types', () => {
    const expectedTypes: ComponentType[] = [
      'AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR',
      'D_FLIP_FLOP', 'JK_FLIP_FLOP', 'MUX',
      'LED', 'SWITCH', 'CLOCK', 'VCC', 'GND',
      'SEVEN_SEG', 'HALF_ADDER', 'FULL_ADDER',
    ]
    for (const t of expectedTypes) {
      expect(COMPONENT_TEMPLATES[t], `missing template for ${t}`).toBeDefined()
    }
  })

  it('all templates have valid categories', () => {
    const validCategories = new Set(['power', 'logic', 'memory', 'io', 'complex'])
    for (const [type, tmpl] of Object.entries(COMPONENT_TEMPLATES)) {
      expect(validCategories.has(tmpl.category), `${type} has invalid category: ${tmpl.category}`).toBe(true)
    }
  })

  it('all templates have positive dimensions', () => {
    for (const [type, tmpl] of Object.entries(COMPONENT_TEMPLATES)) {
      expect(tmpl.width, `${type} width <= 0`).toBeGreaterThan(0)
      expect(tmpl.height, `${type} height <= 0`).toBeGreaterThan(0)
    }
  })

  it('all templates have at least one pin', () => {
    for (const [type, tmpl] of Object.entries(COMPONENT_TEMPLATES)) {
      expect(tmpl.pins.length, `${type} has no pins`).toBeGreaterThan(0)
    }
  })

  it('all pin positions are numbers', () => {
    for (const [type, tmpl] of Object.entries(COMPONENT_TEMPLATES)) {
      for (const pin of tmpl.pins) {
        expect(typeof pin.position.x, `${type}.${pin.name} x is not number`).toBe('number')
        expect(typeof pin.position.y, `${type}.${pin.name} y is not number`).toBe('number')
      }
    }
  })

  it('logic gates have correct input/output counts', () => {
    expect(COMPONENT_TEMPLATES.AND.pins.filter(p => p.type === 'input').length).toBe(2)
    expect(COMPONENT_TEMPLATES.AND.pins.filter(p => p.type === 'output').length).toBe(1)
    expect(COMPONENT_TEMPLATES.OR.pins.filter(p => p.type === 'input').length).toBe(2)
    expect(COMPONENT_TEMPLATES.NOT.pins.filter(p => p.type === 'input').length).toBe(1)
    expect(COMPONENT_TEMPLATES.NOT.pins.filter(p => p.type === 'output').length).toBe(1)
    expect(COMPONENT_TEMPLATES.XOR.pins.filter(p => p.type === 'input').length).toBe(2)
    expect(COMPONENT_TEMPLATES.NAND.pins.filter(p => p.type === 'input').length).toBe(2)
    expect(COMPONENT_TEMPLATES.NOR.pins.filter(p => p.type === 'input').length).toBe(2)
  })

  it('D_FLIP_FLOP has D, CLK inputs and Q, QB outputs', () => {
    const tmpl = COMPONENT_TEMPLATES.D_FLIP_FLOP
    const pinNames = tmpl.pins.map(p => p.name)
    expect(pinNames).toContain('D')
    expect(pinNames).toContain('CLK')
    expect(pinNames).toContain('Q')
    expect(pinNames).toContain('QB')
  })

  it('JK_FLIP_FLOP has J, K, CLK inputs and Q, QB outputs', () => {
    const tmpl = COMPONENT_TEMPLATES.JK_FLIP_FLOP
    const pinNames = tmpl.pins.map(p => p.name)
    expect(pinNames).toContain('J')
    expect(pinNames).toContain('K')
    expect(pinNames).toContain('CLK')
    expect(pinNames).toContain('Q')
    expect(pinNames).toContain('QB')
  })

  it('MUX has I0, I1, S inputs and Y output', () => {
    const tmpl = COMPONENT_TEMPLATES.MUX
    const pinNames = tmpl.pins.map(p => p.name)
    expect(pinNames).toContain('I0')
    expect(pinNames).toContain('I1')
    expect(pinNames).toContain('S')
    expect(pinNames).toContain('Y')
  })

  it('SEVEN_SEG has 7 input pins', () => {
    const tmpl = COMPONENT_TEMPLATES.SEVEN_SEG
    expect(tmpl.pins.length).toBe(7)
    expect(tmpl.pins.every(p => p.type === 'input')).toBe(true)
  })

  it('HALF_ADDER has A, B inputs and Sum, Carry outputs', () => {
    const tmpl = COMPONENT_TEMPLATES.HALF_ADDER
    const pinNames = tmpl.pins.map(p => p.name)
    expect(pinNames).toContain('A')
    expect(pinNames).toContain('B')
    expect(pinNames).toContain('Sum')
    expect(pinNames).toContain('Carry')
  })

  it('FULL_ADDER has A, B, Cin inputs and Sum, Cout outputs', () => {
    const tmpl = COMPONENT_TEMPLATES.FULL_ADDER
    const pinNames = tmpl.pins.map(p => p.name)
    expect(pinNames).toContain('A')
    expect(pinNames).toContain('B')
    expect(pinNames).toContain('Cin')
    expect(pinNames).toContain('Sum')
    expect(pinNames).toContain('Cout')
  })

  it('VCC and GND are in power category', () => {
    expect(COMPONENT_TEMPLATES.VCC.category).toBe('power')
    expect(COMPONENT_TEMPLATES.GND.category).toBe('power')
  })

  it('LED, SWITCH and CLOCK are in io category', () => {
    expect(COMPONENT_TEMPLATES.LED.category).toBe('io')
    expect(COMPONENT_TEMPLATES.SWITCH.category).toBe('io')
    expect(COMPONENT_TEMPLATES.CLOCK.category).toBe('io')
  })
})

describe('createComponent', () => {
  it('creates a component with correct type, position, size, and label', () => {
    const comp = createComponent('AND', 100, 200)
    expect(comp.type).toBe('AND')
    expect(comp.x).toBe(100)
    expect(comp.y).toBe(200)
    expect(comp.width).toBe(COMPONENT_TEMPLATES.AND.width)
    expect(comp.height).toBe(COMPONENT_TEMPLATES.AND.height)
    expect(comp.label).toBe(COMPONENT_TEMPLATES.AND.label)
  })

  it('assigns unique IDs to each component', () => {
    const a = createComponent('OR', 0, 0)
    const b = createComponent('OR', 0, 0)
    expect(a.id).not.toBe(b.id)
  })

  it('assigns unique pin IDs within the same component', () => {
    const comp = createComponent('AND', 0, 0)
    const ids = comp.pins.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('assigns unique pin IDs across different components', () => {
    const a = createComponent('AND', 0, 0)
    const b = createComponent('AND', 10, 10)
    const allIds = [...a.pins.map(p => p.id), ...b.pins.map(p => p.id)]
    const unique = new Set(allIds)
    expect(unique.size).toBe(allIds.length)
  })

  it('initialises all pin signals to 0', () => {
    const comp = createComponent('NAND', 0, 0)
    for (const pin of comp.pins) {
      expect(pin.signal).toBe(0)
    }
  })

  it('SWITCH initial state has value 0', () => {
    const comp = createComponent('SWITCH', 0, 0)
    expect(comp.state.value).toBe(0)
  })

  it('CLOCK initial state has value 0', () => {
    const comp = createComponent('CLOCK', 0, 0)
    expect(comp.state.value).toBe(0)
  })

  it('D_FLIP_FLOP initial state has q=0 and prevClk=0', () => {
    const comp = createComponent('D_FLIP_FLOP', 0, 0)
    expect(comp.state.q).toBe(0)
    expect(comp.state.prevClk).toBe(0)
  })

  it('JK_FLIP_FLOP initial state has q=0 and prevClk=0', () => {
    const comp = createComponent('JK_FLIP_FLOP', 0, 0)
    expect(comp.state.q).toBe(0)
    expect(comp.state.prevClk).toBe(0)
  })

  it('pure logic gates have empty initial state', () => {
    for (const type of ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'] as ComponentType[]) {
      const comp = createComponent(type, 0, 0)
      expect(Object.keys(comp.state)).toHaveLength(0)
    }
  })

  it('creates correct number of pins matching the template', () => {
    for (const type of Object.keys(COMPONENT_TEMPLATES) as ComponentType[]) {
      const comp = createComponent(type, 0, 0)
      expect(comp.pins.length).toBe(COMPONENT_TEMPLATES[type].pins.length)
    }
  })

  it('preserves pin names and types from template', () => {
    const comp = createComponent('FULL_ADDER', 0, 0)
    const tmpl = COMPONENT_TEMPLATES.FULL_ADDER
    for (let i = 0; i < tmpl.pins.length; i++) {
      expect(comp.pins[i].name).toBe(tmpl.pins[i].name)
      expect(comp.pins[i].type).toBe(tmpl.pins[i].type)
    }
  })
})
