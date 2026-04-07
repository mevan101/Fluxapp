import { useState } from 'react'
import { Zap, Play, Pause, SkipForward, Save, Share2, Download } from 'lucide-react'
import Badge from '../ui/Badge'

interface ToolbarProps {
  circuitName: string
  isRunning: boolean
  speed: number
  componentCount: number
  wireCount: number
  onNameChange: (name: string) => void
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  onSpeedChange: (s: number) => void
}

export default function Toolbar({
  circuitName,
  isRunning,
  speed,
  componentCount,
  wireCount,
  onNameChange,
  onPlay,
  onPause,
  onStep,
  onSpeedChange,
}: ToolbarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(circuitName)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const SPEEDS = [0.5, 1, 2, 4]

  return (
    <div className="h-12 bg-gray-950 border-b border-gray-800 flex items-center px-3 gap-3 flex-shrink-0 relative z-40">
      <div className="flex items-center gap-1.5 text-signal font-mono font-bold text-lg">
        <Zap className="w-4 h-4 fill-signal" />
        FLUX
      </div>

      <div className="w-px h-6 bg-gray-700" />

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
          className="bg-gray-800 border border-signal rounded px-2 py-0.5 text-sm text-white font-mono focus:outline-none w-48"
        />
      ) : (
        <button
          onClick={() => { setDraft(circuitName); setEditing(true) }}
          className="text-sm text-gray-200 font-mono hover:text-signal transition-colors px-1"
          title="Click to rename"
        >
          {circuitName}
        </button>
      )}

      <div className="w-px h-6 bg-gray-700" />

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
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 border border-gray-700 hover:bg-gray-800 transition-colors"
          title="Step one clock cycle"
        >
          <SkipForward className="w-3 h-3" />
          Step
        </button>
      </div>

      <div className="flex items-center gap-1">
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
              speed === s
                ? 'bg-signal text-black font-bold'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-700" />

      <Badge color={isRunning ? 'green' : 'gray'}>
        {isRunning ? '● Running' : '⏸ Paused'}
      </Badge>

      <div className="flex-1" />

      <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
        <span>{componentCount} components</span>
        <span>{wireCount} wires</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => showToast('Circuit saved!')}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
        <button
          onClick={() => showToast('Link copied!')}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
        <button
          onClick={() => showToast('Exported!')}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {toast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1.5 bg-green-700 text-white text-xs rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
