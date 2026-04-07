import { useState } from 'react'
import { Search, Heart, GitFork, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { SAMPLE_CIRCUITS } from '../data/sampleCircuits'
import { Circuit } from '../types/circuit'

const STORAGE_KEY = 'flux-saved-circuit'

const CATEGORIES = ['All', 'Gates', 'Adders', 'Memory']

// Community circuits (static display only)
const COMMUNITY_CIRCUITS = [
  { name: '8-bit Ripple Adder', author: 'Elena V.', initials: 'EV', likes: 342, category: 'Adders', forks: 89 },
  { name: '4-bit Counter', author: 'Priya N.', initials: 'PN', likes: 178, category: 'Memory', forks: 34 },
  { name: 'Ring Oscillator', author: 'Alex R.', initials: 'AR', likes: 134, category: 'Memory', forks: 22 },
  { name: 'Priority Encoder', author: 'Noah S.', initials: 'NS', likes: 98, category: 'Gates', forks: 19 },
  { name: 'Multiplexer 4:1', author: 'Lily W.', initials: 'LW', likes: 123, category: 'Gates', forks: 31 },
  { name: 'Shift Register', author: 'Oliver P.', initials: 'OP', likes: 111, category: 'Memory', forks: 28 },
  { name: 'Binary to Gray Code', author: 'Emma D.', initials: 'ED', likes: 87, category: 'Gates', forks: 15 },
]

// Map sample circuit ids to categories
const SAMPLE_CATEGORIES: Record<string, string> = {
  'demo-and-gate': 'Gates',
  'demo-xor-gate': 'Gates',
  'demo-half-adder': 'Adders',
  'demo-sr-latch': 'Memory',
  'demo-d-flipflop': 'Memory',
}

function CircuitSVGPreview({ category }: { category: string }) {
  const colors: Record<string, string> = {
    Gates: '#00d4ff', Adders: '#10b981', Memory: '#7c3aed', CPUs: '#f59e0b', Fun: '#ec4899', All: '#00d4ff',
  }
  const c = colors[category] ?? '#00d4ff'
  return (
    <svg width="100%" height="80" viewBox="0 0 200 80" style={{ background: '#0a0c10' }}>
      <rect x="40" y="20" width="50" height="40" rx="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" />
      <text x="65" y="44" textAnchor="middle" fill={c} fontSize="12" fontFamily="monospace" opacity="0.8">
        {category === 'Adders' ? 'FA' : category === 'Memory' ? 'DFF' : category === 'CPUs' ? 'ALU' : '&amp;'}
      </text>
      <line x1="0" y1="30" x2="40" y2="30" stroke={c} strokeWidth="1.5" opacity="0.5" />
      <line x1="0" y1="50" x2="40" y2="50" stroke={c} strokeWidth="1.5" opacity="0.5" />
      <line x1="90" y1="40" x2="130" y2="40" stroke={c} strokeWidth="1.5" opacity="0.5" />
      <circle cx="0" cy="30" r="3" fill={c} opacity="0.7" />
      <circle cx="0" cy="50" r="3" fill={c} opacity="0.7" />
      <circle cx="130" cy="40" r="4" fill={c} opacity="0.9" />
      <rect x="140" y="28" width="18" height="24" rx="12" fill={c} opacity="0.3" stroke={c} strokeWidth="1" />
      <circle cx="149" cy="40" r="6" fill={c} opacity="0.6" />
    </svg>
  )
}

function SampleCircuitCard({ circuit, category }: { circuit: Circuit; category: string }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)

  function openInSimulator() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(circuit))
    navigate('/simulator')
  }

  const badgeColor = category === 'Adders' ? 'green' : category === 'Memory' ? 'purple' : 'cyan'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-signal/50 transition-colors group">
      <div className="overflow-hidden">
        <CircuitSVGPreview category={category} />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm text-gray-100 group-hover:text-signal transition-colors leading-tight">
            {circuit.name}
          </h3>
          <Badge color={badgeColor}>{category}</Badge>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-signal/60 to-purple-500/60 flex items-center justify-center text-xs font-bold text-white">
            F
          </div>
          <span className="text-xs text-gray-500">FLUX Example</span>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLiked(v => !v)}
            className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            {liked ? 1 : 0}
          </button>
          <button
            onClick={openInSimulator}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-signal/10 text-signal border border-signal/30 hover:bg-signal/20 transition-colors font-semibold"
          >
            <Zap className="w-3 h-3" />
            Open
          </button>
        </div>
      </div>
    </div>
  )
}


export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [liked, setLiked] = useState<Set<string>>(new Set())

  // Sample circuits (openable in simulator)
  const filteredSamples = SAMPLE_CIRCUITS.filter(c => {
    const cat = SAMPLE_CATEGORIES[c.id] ?? 'Gates'
    return (
      (activeCategory === 'All' || cat === activeCategory) &&
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  })

  // Community circuits (display only)
  const filteredCommunity = COMMUNITY_CIRCUITS.filter(c =>
    (activeCategory === 'All' || c.category === activeCategory) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Circuit Gallery</h1>
        <p className="text-gray-500">Explore example circuits — click <span className="text-signal font-semibold">Open</span> to load any circuit straight into the simulator</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search circuits..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-signal"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === c
                  ? 'bg-signal text-black'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Example circuits (openable) */}
      {filteredSamples.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-signal mb-3">⚡ Interactive Examples — Open in Simulator</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSamples.map(circuit => (
              <SampleCircuitCard
                key={circuit.id}
                circuit={circuit}
                category={SAMPLE_CATEGORIES[circuit.id] ?? 'Gates'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Community circuits */}
      {filteredCommunity.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-400 mb-3">Community Circuits</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCommunity.map(circuit => (
              <div
                key={circuit.name}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors group"
              >
                <div className="overflow-hidden">
                  <CircuitSVGPreview category={circuit.category} />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-100 group-hover:text-white transition-colors leading-tight">
                      {circuit.name}
                    </h3>
                    <Badge color={
                      circuit.category === 'Adders' ? 'green'
                      : circuit.category === 'Memory' ? 'purple'
                      : 'cyan'
                    }>
                      {circuit.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-signal/60 to-purple-500/60 flex items-center justify-center text-xs font-bold text-white">
                      {circuit.initials}
                    </div>
                    <span className="text-xs text-gray-500">{circuit.author}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setLiked(prev => {
                        const next = new Set(prev)
                        if (next.has(circuit.name)) next.delete(circuit.name)
                        else next.add(circuit.name)
                        return next
                      })}
                      className={`flex items-center gap-1 text-xs transition-colors ${liked.has(circuit.name) ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${liked.has(circuit.name) ? 'fill-current' : ''}`} />
                      {circuit.likes + (liked.has(circuit.name) ? 1 : 0)}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                      <GitFork className="w-3 h-3" /> {circuit.forks}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredSamples.length === 0 && filteredCommunity.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No circuits found matching &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
