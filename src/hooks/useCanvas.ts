import { useState, useRef, useCallback, useEffect } from 'react'

export interface Viewport {
  x: number
  y: number
  zoom: number
}

export function useCanvas() {
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const isPanning = useRef(false)
  const lastPan = useRef({ x: 0, y: 0 })
  const spaceHeld = useRef(false)

  const worldToScreen = useCallback((wx: number, wy: number, vp: Viewport) => {
    return {
      x: wx * vp.zoom + vp.x,
      y: wy * vp.zoom + vp.y,
    }
  }, [])

  const screenToWorld = useCallback((sx: number, sy: number, vp: Viewport) => {
    return {
      x: (sx - vp.x) / vp.zoom,
      y: (sy - vp.y) / vp.zoom,
    }
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setViewport(prev => {
      const newZoom = Math.min(4, Math.max(0.25, prev.zoom * delta))
      const scale = newZoom / prev.zoom
      return {
        zoom: newZoom,
        x: mouseX - scale * (mouseX - prev.x),
        y: mouseY - scale * (mouseY - prev.y),
      }
    })
  }, [])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 1 || spaceHeld.current) {
      isPanning.current = true
      lastPan.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    }
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastPan.current.x
      const dy = e.clientY - lastPan.current.y
      lastPan.current = { x: e.clientX, y: e.clientY }
      setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    isPanning.current = false
  }, [])

  useEffect(() => {
    // Use Alt key (not Space) for pan to avoid conflict with Space = play/pause
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        spaceHeld.current = true
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        spaceHeld.current = false
        if (canvasRef.current) canvasRef.current.style.cursor = 'default'
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp])

  return { viewport, setViewport, canvasRef, worldToScreen, screenToWorld }
}
