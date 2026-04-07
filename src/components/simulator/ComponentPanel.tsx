import { useState } from 'react'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { ComponentType } from '../../types/circuit'
import { COMPONENT_TEMPLATES } from '../../data/components'

interface ComponentPanelProps {
  onSelectComponent: (type: ComponentType) => void
}

const CATEGORIES = [
  {
    label: 'Power',
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/30',
    types: ['VCC', 'GND'] as ComponentType[],
  },
  {
    label: 'Logic Gates',
    color: 'text-cyan-400',
    bg: 'bg-cyan-900/30',
    types: ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'] as ComponentType[],
  },
  {
    label: 'Memory',
    color: 'text-purple-400',
    bg: 'bg-purple-900/30',
    types: ['D_FLIP_FLOP', 'JK_FLIP_FLOP'] as ComponentType[],
  },
  {
    label: 'I/O',
    color: 'text-green-400',
    bg: 'bg-green-900/30',
    types: ['LED', 'SWITCH', 'CLOCK'] as ComponentType[],
  },
  {
    label: 'Complex',
    color: 'text-orange-400',
    bg: 'bg-orange-900/30',
    types: ['MUX', 'HALF_ADDER', 'FULL_ADDER', 'SEVEN_SEG'] as ComponentType[],
  },
]

export default function ComponentPanel({ onSelectComponent }: ComponentPanelProps) {
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (label: string) => setCollapsed(c => ({ ...c, [label]: !c[label] }))

  const filtered = search
    ? CATEGORIES.map(cat => ({
        ...cat,
        types: cat.types.filter(t =>
          COMPONENT_TEMPLATES[t].label.toLowerCase().includes(search.toLowerCase()) ||
          t.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.types.length > 0)
    : CATEGORIES

  return (
    <div className="w-48 bg-gray-950 border-r border-gray-800 h-full flex flex-col overflow-hidden">
      <div className="p-2 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-6 pr-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-signal"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map(cat => (
          <div key={cat.label}>
            <button
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold ${cat.color} hover:bg-gray-800 transition-colors`}
              onClick={() => toggle(cat.label)}
            >
              <span>{cat.label}</span>
              {collapsed[cat.label] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {!collapsed[cat.label] && (
              <div className="pb-1">
                {cat.types.map(type => {
                  const tmpl = COMPONENT_TEMPLATES[type]
                  return (
                    <button
                      key={type}
                      className={`w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:${cat.bg} hover:bg-gray-800 transition-colors flex items-center gap-2`}
                      onClick={() => onSelectComponent(type)}
                      title={`Click to place ${tmpl.label}`}
                    >
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${cat.bg} ${cat.color} border border-current/30`}>
                        {type.length > 4 ? type.slice(0, 4) : type}
                      </span>
                      <span className="truncate">{tmpl.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-gray-800 text-xs text-gray-600 text-center">
        Click to place
      </div>
    </div>
  )
}
