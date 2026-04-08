import { useState } from 'react'
import { Zap, Play, Pause, SkipForward, Save, FolderOpen, Download, RotateCcw, ChevronDown, ZoomIn, ZoomOut, Maximize2, Trash2, Sun, Moon, HelpCircle, X } from 'lucide-react'
import Badge from '../ui/Badge'
import { Circuit } from '../../types/circuit'
import { Viewport } from '../../hooks/useCanvas'
import { WiringState } from '../../hooks/useWiring'
import { downloadCircuitSvg, downloadCircuitJson } from '../../utils/export'

interface ToolbarProps {
  circuitName: string
  isRunning: boolean
  speed: number
  componentCount: number
  wireCount: number
  circuit: Circuit
  viewport: Viewport
  setViewport: (vp: Viewport | ((prev: Viewport) => Viewport)) => void
  canvasRef?: React.RefObject<HTMLDivElement>
  wiringState?: WiringState
  lightMode?: boolean
  onNameChange: (name: string) => void
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  onSpeedChange: (s: number) => void
  onLoadCircuit: (circuit: Circuit) => void
  onUndo: () => void
  onClear?: () => void
  onCancelWire?: () => void
  onToggleLightMode?: () => void
}

const STORAGE_KEY = 'flux-saved-circuit'

const SHORTCUTS = [
  { key: 'Space + drag', desc: 'Pan canvas' },
  { key: 'Scroll wheel', desc: 'Zoom in/out' },
  { key: 'Escape', desc: 'Cancel wire / deselect' },
  { key: 'Delete / Backspace', desc: 'Delete selected component' },
  { key: 'Ctrl+Z', desc: 'Undo' },
  { key: 'Click output pin → input pin', desc: 'Connect wire' },
  { key: 'Right-click component', desc: 'Context menu (Delete/Duplicate/Rename)' },
  { key: 'Right-click canvas', desc: 'Cancel wire' },
  { key: 'Drag from panel', desc: 'Place component' },
  { key: 'Double-click switch', desc: 'Toggle switch' },
]

export default function Toolbar({
  circuitName,
  isRunning,
  speed,
  componentCount,
  wireCount,
  circuit,
  viewport,
  setViewport,
  canvasRef,
  wiringState,
  lightMode,
  onNameChange,
  onPlay,
  onPause,
  onStep,
  onSpeedChange,
  onLoadCircuit,
  onUndo,
  onClear,
  onCancelWire,
  onToggleLightMode,
}: ToolbarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(circuitName)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2500)
  }

  function handleSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...circuit, name: circuitName }))
      showToast('Circuit saved to browser!')
    } catch {
      showToast('Save failed', false)
    }
  }

  function handleLoad() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) { showToast('No saved circuit found', false); return }
      const loaded = JSON.parse(raw) as Circuit
      onLoadCircuit(loaded)
      onNameChange(loaded.name)
      showToast(`Loaded "${loaded.name}"`)
    } catch {
      showToast('Load failed', false)
    }
  }

  function handleExportJson() {
    try { downloadCircuitJson(circuit, circuitName); showToast('Exported as JSON!') }
    catch { showToast('Export failed', false) }
    setExportOpen(false)
  }

  function handleExportSvg() {
    try { downloadCircuitSvg(circuit, circuitName); showToast('Exported as SVG!') }
    catch { showToast('Export failed', false) }
    setExportOpen(false)
  }

  function handleZoomIn() {
    setViewport(prev => ({ ...prev, zoom: Math.min(4, prev.zoom * 1.1) }))
  }

  function handleZoomOut() {
    setViewport(prev => ({ ...prev, zoom: Math.max(0.25, prev.zoom / 1.1) }))
  }

  function handleFit() {
    if (circuit.components.length === 0) {
      setViewport({ x: 0, y: 0, zoom: 1 })
      return
    }
    const canvasEl = canvasRef?.current
    const cw = canvasEl?.clientWidth ?? 800
    const ch = canvasEl?.clientHeight ?? 600
    const padding = 60
    const minX = Math.min(...circuit.components.map(c => c.x))
    const minY = Math.min(...circuit.components.map(c => c.y))
    const maxX = Math.max(...circuit.components.map(c => c.x + c.width))
    const maxY = Math.max(...circuit.components.map(c => c.y + c.height))
    const bw = maxX - minX, bh = maxY - minY
    const zoom = Math.min(4, Math.max(0.25, Math.min((cw - padding * 2) / bw, (ch - padding * 2) / bh)))
    setViewport({
      zoom,
      x: (cw - bw * zoom) / 2 - minX * zoom,
      y: (ch - bh * zoom) / 2 - minY * zoom,
    })
  }

  function handleClear() {
    if (window.confirm('Clear the circuit? This cannot be undone.')) {
      onClear?.()
    }
  }

  const SPEEDS = [0.5, 1, 2, 4]
  const isWiring = wiringState?.active ?? false

  return (
    <div className={`h-12 border-b flex items-center px-3 gap-2 flex-shrink-0 relative z-40 ${lightMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-950 border-gray-800'}`}>
      <div className="flex items-center gap-1.5 text-signal font-mono font-bold text-lg">
        <Zap className="w-4 h-4 fill-signal" />
        FLUX
      </div>

      <div className={`w-px h-6 ${lightMode ? 'bg-gray-300' : 'bg-gray-700'}`} />

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { onNameChange(draft); setEditing(false) }}
          onKeyDown={e => {
            if (e.key === 'Enter') { onNameChange(draft); setEditing(false) }
            if (e.key === 'Escape') { setDraft(circuitName); setEditing(false) }
          }}
          className="bg-gray-800 border border-signal rounded px-2 py-0.5 text-sm text-white font-mono focus:outline-none w-40"
        />
      ) : (
        <button
          onClick={() => { setDraft(circuitName); setEditing(true) }}
          className={`text-sm font-mono hover:text-signal transition-colors px-1 ${lightMode ? 'text-gray-800' : 'text-gray-200'}`}
          title="Click to rename"
        >
          {circuitName}
        </button>
      )}

      <div className={`w-px h-6 ${lightMode ? 'bg-gray-300' : 'bg-gray-700'}`} />

      {/* Playback controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={isRunning ? onPause : onPlay}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-semibold transition-colors ${
            isRunning
              ? 'bg-green-600/30 text-green-400 border border-green-700 hover:bg-green-600/50'
              : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onStep}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${lightMode ? 'text-gray-600 border-gray-300 hover:bg-gray-200' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
          title="Step one clock cycle"
        >
          <SkipForward className="w-3 h-3" />
          Step
        </button>
        <button
          onClick={onUndo}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${lightMode ? 'text-gray-600 border-gray-300 hover:bg-gray-200' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1">
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
              speed === s ? 'bg-signal text-black font-bold' : lightMode ? 'text-gray-500 hover:text-gray-800' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className={`w-px h-6 ${lightMode ? 'bg-gray-300' : 'bg-gray-700'}`} />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          className={`p-1 rounded text-xs border transition-colors ${lightMode ? 'text-gray-600 border-gray-300 hover:bg-gray-200' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className={`text-xs font-mono w-10 text-center ${lightMode ? 'text-gray-600' : 'text-gray-400'}`}>
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className={`p-1 rounded text-xs border transition-colors ${lightMode ? 'text-gray-600 border-gray-300 hover:bg-gray-200' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${lightMode ? 'text-gray-600 border-gray-300 hover:bg-gray-200' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
          title="Fit all components in view"
        >
          <Maximize2 className="w-3 h-3" />
          Fit
        </button>
      </div>

      <div className={`w-px h-6 ${lightMode ? 'bg-gray-300' : 'bg-gray-700'}`} />

      {/* Wire status */}
      {isWiring && (
        <button
          onClick={onCancelWire}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-amber-600/30 text-amber-400 border border-amber-700 hover:bg-amber-600/50 transition-colors"
          title="Cancel wiring (Escape)"
        >
          🔗 Connecting… (Cancel)
        </button>
      )}

      <Badge color={isRunning ? 'green' : 'gray'}>
        {isRunning ? '● Running' : '⏸ Paused'}
      </Badge>

      <div className="flex-1" />

      <div className={`flex items-center gap-3 text-xs font-mono ${lightMode ? 'text-gray-500' : 'text-gray-500'}`}>
        <span>{componentCount} comps</span>
        <span>{wireCount} wires</span>
      </div>

      {/* Clear */}
      <button
        onClick={handleClear}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors text-red-400 border-red-900 hover:bg-red-900/30`}
        title="Clear canvas"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Clear
      </button>

      <div className={`w-px h-6 ${lightMode ? 'bg-gray-300' : 'bg-gray-700'}`} />

      {/* Save / Load / Export */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${lightMode ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          title="Save to browser"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
        <button
          onClick={handleLoad}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${lightMode ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          title="Load last saved circuit"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Load
        </button>
        <div className="relative">
          <button
            onClick={() => setExportOpen(o => !o)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${lightMode ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Download className="w-3.5 h-3.5" />
            Export
            <ChevronDown className="w-3 h-3" />
          </button>
          {exportOpen && (
            <div
              className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[140px] overflow-hidden"
              onMouseLeave={() => setExportOpen(false)}
            >
              <button onClick={handleExportSvg} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2">
                <span className="text-signal font-mono">SVG</span> Export as SVG
              </button>
              <button onClick={handleExportJson} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2">
                <span className="text-purple-400 font-mono">JSON</span> Export as JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Light/Dark toggle */}
      <button
        onClick={onToggleLightMode}
        className={`p-1.5 rounded border transition-colors ${lightMode ? 'text-gray-700 border-gray-300 hover:bg-gray-200' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
        title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {lightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </button>

      {/* Help */}
      <button
        onClick={() => setShowHelp(true)}
        className={`p-1.5 rounded border transition-colors ${lightMode ? 'text-gray-700 border-gray-300 hover:bg-gray-200' : 'text-gray-400 border-gray-700 hover:bg-gray-800'}`}
        title="Keyboard shortcuts"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {/* Toast */}
      {toast && (
        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1.5 text-white text-xs rounded shadow-lg z-50 ${toast.ok ? 'bg-green-700' : 'bg-red-700'}`}>
          {toast.msg}
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 w-[480px] max-w-[95vw]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="shortcuts-title" className="text-signal font-mono font-bold text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> Keyboard Shortcuts
              </h2>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {SHORTCUTS.map(s => (
                <div key={s.key} className="flex items-start gap-4">
                  <kbd className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-xs font-mono text-signal whitespace-nowrap min-w-[180px]">{s.key}</kbd>
                  <span className="text-xs text-gray-300">{s.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center font-mono">
              FLUX Circuit Simulator
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
