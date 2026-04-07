import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCanvas, Viewport } from '../../hooks/useCanvas'

describe('useCanvas – initial state', () => {
  it('starts with default viewport (x=0, y=0, zoom=1)', () => {
    const { result } = renderHook(() => useCanvas())
    expect(result.current.viewport).toEqual({ x: 0, y: 0, zoom: 1 })
  })

  it('exposes a canvasRef', () => {
    const { result } = renderHook(() => useCanvas())
    expect(result.current.canvasRef).toBeDefined()
  })
})

describe('useCanvas – worldToScreen', () => {
  it('identity at zoom=1, no offset', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 0, y: 0, zoom: 1 }
    expect(result.current.worldToScreen(100, 200, vp)).toEqual({ x: 100, y: 200 })
  })

  it('scales by zoom', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 0, y: 0, zoom: 2 }
    expect(result.current.worldToScreen(50, 75, vp)).toEqual({ x: 100, y: 150 })
  })

  it('applies viewport offset', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 30, y: 40, zoom: 1 }
    expect(result.current.worldToScreen(10, 20, vp)).toEqual({ x: 40, y: 60 })
  })

  it('combines zoom and offset', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 10, y: 20, zoom: 2 }
    // wx * zoom + vp.x = 5*2 + 10 = 20
    // wy * zoom + vp.y = 8*2 + 20 = 36
    expect(result.current.worldToScreen(5, 8, vp)).toEqual({ x: 20, y: 36 })
  })

  it('handles origin (0,0)', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 50, y: 50, zoom: 3 }
    expect(result.current.worldToScreen(0, 0, vp)).toEqual({ x: 50, y: 50 })
  })
})

describe('useCanvas – screenToWorld', () => {
  it('identity at zoom=1, no offset', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 0, y: 0, zoom: 1 }
    expect(result.current.screenToWorld(100, 200, vp)).toEqual({ x: 100, y: 200 })
  })

  it('divides by zoom', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 0, y: 0, zoom: 2 }
    expect(result.current.screenToWorld(100, 150, vp)).toEqual({ x: 50, y: 75 })
  })

  it('subtracts viewport offset before dividing', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 30, y: 40, zoom: 1 }
    expect(result.current.screenToWorld(40, 60, vp)).toEqual({ x: 10, y: 20 })
  })

  it('combines zoom and offset', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 10, y: 20, zoom: 2 }
    // (sx - vp.x) / zoom = (20 - 10) / 2 = 5
    // (sy - vp.y) / zoom = (36 - 20) / 2 = 8
    expect(result.current.screenToWorld(20, 36, vp)).toEqual({ x: 5, y: 8 })
  })

  it('worldToScreen and screenToWorld are inverses', () => {
    const { result } = renderHook(() => useCanvas())
    const vp: Viewport = { x: 15, y: -30, zoom: 1.5 }
    const wx = 123, wy = 456
    const screen = result.current.worldToScreen(wx, wy, vp)
    const back = result.current.screenToWorld(screen.x, screen.y, vp)
    expect(back.x).toBeCloseTo(wx)
    expect(back.y).toBeCloseTo(wy)
  })
})
