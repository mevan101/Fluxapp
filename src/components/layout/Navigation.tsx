import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/classroom', label: 'Classroom' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Navigation() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-signal font-bold text-xl font-mono">
          <Zap className="w-5 h-5 fill-signal text-signal" />
          FLUX
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                location.pathname === l.to
                  ? 'text-signal bg-signal/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono">v0.1</span>
          <button className="px-4 py-1.5 rounded-lg bg-signal text-black text-sm font-semibold hover:bg-cyan-300 transition-colors">
            Sign In
          </button>
        </div>

        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-800 px-4 py-3 flex flex-col gap-2">
          {LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm ${
                location.pathname === l.to
                  ? 'text-signal bg-signal/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button className="mt-2 px-4 py-2 rounded-lg bg-signal text-black text-sm font-semibold">
            Sign In
          </button>
        </div>
      )}
    </nav>
  )
}
