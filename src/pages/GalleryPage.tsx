import { useState } from 'react'
import { Search, Heart, GitFork, Star } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const CATEGORIES = ['All', 'Gates', 'Adders', 'CPUs', 'Memory', 'Fun']

const CIRCUITS = [
  { name: '8-bit Ripple Adder', author: 'Elena V.', initials: 'EV', likes: 342, category: 'Adders', forks: 89 },
  { name: 'SR Latch', author: 'Marcus T.', initials: 'MT', likes: 201, category: 'Memory', forks: 45 },
  { name: '4-bit Counter', author: 'Priya N.', initials: 'PN', likes: 178, category: 'Memory', forks: 34 },
  { name: '7-Seg Decoder', author: 'Sam K.', initials: 'SK', likes: 156, category: 'Gates', forks: 67 },
  { name: 'Ring Oscillator', author: 'Alex R.', initials: 'AR', likes: 134, category: 'Fun', forks: 22 },
  { name: 'Full Adder', author: 'Chris L.', initials: 'CL', likes: 289, category: 'Adders', forks: 78 },
  { name: 'Half Adder', author: 'Jordan B.', initials: 'JB', likes: 167, category: 'Adders', forks: 43 },
  { name: 'D Flip-Flop', author: 'Mia Z.', initials: 'MZ', likes: 145, category: 'Memory', forks: 56 },
  { name: 'Priority Encoder', author: 'Noah S.', initials: 'NS', likes: 98, category: 'Gates', forks: 19 },
  { name: 'Multiplexer 4:1', author: 'Lily W.', initials: 'LW', likes: 123, category: 'Gates', forks: 31 },
  { name: 'Shift Register', author: 'Oliver P.', initials: 'OP', likes: 111, category: 'Memory', forks: 28 },
  { name: 'Binary to Gray Code', author: 'Emma D.', initials: 'ED', likes: 87, category: 'Gates', forks: 15 },
]

function CircuitSVGPreview({ category }: { category: string }) {
  const colors: Record<string, string> = {
    Gates: '#00d4ff', Adders: '#10b981', Memory: '#7c3aed', CPUs: '#f59e0b', Fun: '#ec4899', All: '#00d4ff',
  }
  const c = colors[category] ?? '#00d4ff'
  return (
    <svg width="100%" height="80" viewBox="0 0 200 80" style={{ background: '#0a0c10' }}>
      <rect x="40" y="20" width="50" height="40" rx="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" />
      <text x="65" y="44" textAnchor="middle" fill={c} fontSize="12" fontFamily="monospace" opacity="0.8">
        {category === 'Adders' ? 'FA' : category === 'Memory' ? 'DFF' : category === 'CPUs' ? 'ALU' : '&'}
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

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const filtered = CIRCUITS.filter(c =>
    (activeCategory === 'All' || c.category === activeCategory) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Gallery</h1>
        <p className="text-gray-500">Explore and fork circuits built by the FLUX community</p>
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

      {/* Featured circuit */}
      <div className="mb-8 rounded-xl border border-signal/30 bg-gray-900/50 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">Featured Circuit of the Week</span>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">8-bit Ripple Carry Adder</h3>
            <p className="text-gray-400 text-sm mb-4">A full 8-bit binary adder built from 8 full adder stages. Demonstrates carry propagation and binary arithmetic.</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-signal to-purple-500 flex items-center justify-center font-bold text-black text-xs">EV</div>
                <span className="text-sm text-gray-300">Elena V.</span>
              </div>
              <Badge color="green">Adders</Badge>
              <span className="text-sm text-gray-500">❤️ 342</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Open in Simulator</Button>
              <Button size="sm" variant="secondary"><GitFork className="w-3.5 h-3.5" /> Fork</Button>
            </div>
          </div>
          <div className="bg-canvas p-4 flex items-center justify-center min-h-32">
            <svg width="300" height="120" viewBox="0 0 300 120">
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={i} transform={`translate(${i * 70}, 0)`}>
                  <rect x="10" y="30" width="45" height="60" rx="4" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.7" />
                  <text x="32" y="65" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace">FA</text>
                  <line x1="0" y1="40" x2="10" y2="40" stroke="#10b981" strokeWidth="1.5" opacity="0.5" />
                  <line x1="0" y1="55" x2="10" y2="55" stroke="#10b981" strokeWidth="1.5" opacity="0.5" />
                  <line x1="55" y1="60" x2="70" y2="60" stroke="#10b981" strokeWidth="1.5" opacity="0.5" />
                  <line x1="32" y1="90" x2="32" y2="110" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
                  <circle cx="32" cy="112" r="4" fill="#00d4ff" opacity="0.8" />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(circuit => (
          <div
            key={circuit.name}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors group"
          >
            <div className="overflow-hidden">
              <CircuitSVGPreview category={circuit.category} />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm text-gray-100 group-hover:text-signal transition-colors leading-tight">
                  {circuit.name}
                </h3>
                <Badge color={
                  circuit.category === 'Adders' ? 'green'
                  : circuit.category === 'Memory' ? 'purple'
                  : circuit.category === 'CPUs' ? 'yellow'
                  : circuit.category === 'Fun' ? 'red'
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
                <Button variant="ghost" size="sm" className="text-xs py-0.5 px-2">
                  <GitFork className="w-3 h-3" /> {circuit.forks}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No circuits found matching "{search}"</p>
        </div>
      )}
    </div>
  )
}
