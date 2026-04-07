import { Link } from 'react-router-dom'
import {
  Zap, Brain, Users, Check, X, Star, ArrowRight, Cpu, BookOpen,
  Globe, Layers, Moon, Download, Keyboard, RotateCcw, GitFork,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import GitHubStarButton from '../components/ui/GitHubStarButton'

const FEATURES = [
  {
    icon: <Cpu className="w-8 h-8 text-signal" />,
    title: 'Visual Circuit Builder',
    desc: 'Drag-and-drop 60+ components onto an infinite canvas. Real-time signal propagation shows logic states instantly as you build.',
    badge: 'Core',
    color: 'cyan',
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    title: 'AI Learning Tutor',
    desc: 'Stuck? Ask FLUX AI anything — smart hints, concept walkthroughs, and guided debugging. No other circuit tool has this.',
    badge: 'AI-Powered',
    color: 'purple',
  },
  {
    icon: <Globe className="w-8 h-8 text-green-400" />,
    title: 'Community Gallery',
    desc: 'Thousands of shared circuits. Fork, remix, and learn from a global community of engineers and students.',
    badge: 'Social',
    color: 'green',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-yellow-400" />,
    title: 'Classroom Tools',
    desc: 'Create assignments, track student progress in real-time, push hints to individual students, and see common mistakes.',
    badge: 'Education',
    color: 'yellow',
  },
  {
    icon: <Moon className="w-8 h-8 text-blue-400" />,
    title: 'Beautiful Dark UI',
    desc: 'Crafted for long sessions. Crisp dark-mode interface with signal-color coding that makes circuit states unmistakable.',
    badge: 'Design',
    color: 'cyan',
  },
  {
    icon: <Download className="w-8 h-8 text-orange-400" />,
    title: 'Export Anywhere',
    desc: 'Export your circuits as SVG, PNG, or JSON. Share with a link or embed in docs. Your work, your format.',
    badge: 'Portable',
    color: 'orange',
  },
]

// 8 platforms: Falstad, Logisim, CircuitJS, Tinkercad, EveryCircuit, EasyEDA, Multisim, KiCad
// Keep table to FLUX + 5 columns for readability; list remaining two in prose
const COMPARISON = [
  { feature: 'Modern UI/UX',        flux: true,  falstad: false, logisim: false, tinkercad: true,  easyeda: true  },
  { feature: 'No Account Required', flux: true,  falstad: true,  logisim: true,  tinkercad: false, easyeda: false },
  { feature: '100% Free',           flux: true,  falstad: true,  logisim: true,  tinkercad: true,  easyeda: false },
  { feature: 'Open Source',         flux: true,  falstad: true,  logisim: true,  tinkercad: false, easyeda: false },
  { feature: 'Web-Based',           flux: true,  falstad: true,  logisim: false, tinkercad: true,  easyeda: true  },
  { feature: 'Mobile-Responsive',   flux: true,  falstad: false, logisim: false, tinkercad: true,  easyeda: true  },
  { feature: 'Dark Mode',           flux: true,  falstad: false, logisim: false, tinkercad: false, easyeda: true  },
  { feature: 'AI Tutor',            flux: true,  falstad: false, logisim: false, tinkercad: false, easyeda: false },
  { feature: 'Logic Gates',         flux: true,  falstad: true,  logisim: true,  tinkercad: true,  easyeda: true  },
  { feature: 'Flip-Flops',          flux: true,  falstad: true,  logisim: true,  tinkercad: false, easyeda: false },
  { feature: 'Oscilloscope',        flux: true,  falstad: true,  logisim: false, tinkercad: false, easyeda: true  },
  { feature: 'Community Gallery',   flux: true,  falstad: false, logisim: false, tinkercad: true,  easyeda: true  },
  { feature: 'Classroom Tools',     flux: true,  falstad: false, logisim: false, tinkercad: true,  easyeda: false },
  { feature: 'Export SVG / PNG',    flux: true,  falstad: true,  logisim: true,  tinkercad: true,  easyeda: true  },
  { feature: 'Keyboard Shortcuts',  flux: true,  falstad: false, logisim: true,  tinkercad: false, easyeda: false },
  { feature: 'Undo / Redo',         flux: true,  falstad: false, logisim: true,  tinkercad: true,  easyeda: true  },
]

const PLATFORMS = [
  { name: 'Falstad',      url: 'https://www.falstad.com/circuit/',  tag: 'Web · Analog',         note: 'Pioneered browser-based circuit simulation. Inspired our real-time signal rendering.' },
  { name: 'Logisim',      url: 'http://www.cburch.com/logisim/',    tag: 'Desktop · Logic',       note: 'The gold standard for digital logic education. Inspired our component library depth.' },
  { name: 'CircuitJS',    url: 'https://www.falstad.com/circuit/circuitjs.html', tag: 'Web · Open Source', note: 'Modern Falstad fork. Inspired our open-source-first philosophy.' },
  { name: 'Tinkercad',    url: 'https://www.tinkercad.com/',        tag: 'Web · Beginner',        note: "Autodesk's beginner tool. Inspired our classroom management features." },
  { name: 'EveryCircuit', url: 'https://everycircuit.com/',         tag: 'Mobile · Animated',     note: 'Stunning signal animations. Inspired our oscilloscope and signal glow effects.' },
  { name: 'EasyEDA',      url: 'https://easyeda.com/',              tag: 'Web · PCB',             note: 'Professional PCB workflow. Inspired our export system and community gallery.' },
  { name: 'Multisim',     url: 'https://www.multisim.com/',         tag: 'Desktop · SPICE',       note: 'Industry-standard SPICE sim. Inspired our probe/oscilloscope panel design.' },
  { name: 'KiCad',        url: 'https://www.kicad.org/',            tag: 'Desktop · PCB',         note: 'Open-source PCB legend. Inspired our file format and keyboard-first workflow.' },
]

const TESTIMONIALS = [
  {
    initials: 'SK',
    name: 'Sarah K.',
    role: 'EE Student at MIT',
    quote: 'FLUX made me understand flip-flops in 10 minutes. The AI tutor walked me through it step by step. Nothing else comes close.',
    stars: 5,
  },
  {
    initials: 'JM',
    name: 'James M.',
    role: 'High School CS Teacher',
    quote: 'I use FLUX in my classroom every day. The real-time signal visualization is incredible for teaching — and zero sign-up for students.',
    stars: 5,
  },
  {
    initials: 'AR',
    name: 'Anika R.',
    role: 'Hardware Engineer',
    quote: "Finally a circuit simulator that doesn't feel like it was built in 1998. Clean, fast, powerful — and free. What a combo.",
    stars: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="bg-canvas text-gray-100 overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(0,212,255,0.1) 0%, transparent 65%), radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge color="green" className="mb-6 text-sm px-4 py-1.5">
            ⚡ Open Source · No Account · No Cost — Forever
          </Badge>
          <h1
            className="text-7xl md:text-9xl font-black font-mono mb-6 tracking-tight"
            style={{
              color: '#00d4ff',
              textShadow: '0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.2)',
            }}
          >
            FLUX
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-white mb-4">
            The Circuit &amp; Logic Simulator<br />the World Deserves
          </p>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Design, simulate, and learn digital electronics with AI-powered guidance.
            No downloads. No sign-up. No paywalls. Just circuits — open source, always free.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
            <Link to="/simulator">
              <Button size="lg" variant="primary" className="gap-2">
                Start Building Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <GitHubStarButton size="md" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { label: '60+ Components', sub: 'gates, flops & more' },
              { label: 'AI-Powered',     sub: 'smart tutor built-in' },
              { label: 'Real-time Sim',  sub: 'instant propagation' },
              { label: 'MIT Licensed',   sub: 'fork it, own it' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-signal font-bold text-lg font-mono">{s.label}</div>
                <div className="text-gray-500 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need. Nothing You Don't.</h2>
          <p className="text-gray-400 text-lg">Built for students, engineers, and educators — at zero cost.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map(f => (
            <Card
              key={f.title}
              glow={f.color === 'cyan'}
              className="p-8 hover:border-gray-600 transition-colors"
            >
              <div className="mb-4">{f.icon}</div>
              <Badge color={f.color as 'cyan' | 'purple' | 'green' | 'yellow' | 'orange'} className="mb-3">
                {f.badge}
              </Badge>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How FLUX Stacks Up</h2>
            <p className="text-gray-400">
              We studied 8 leading platforms to build something better than all of them combined.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="text-left p-4 text-gray-300 font-semibold min-w-[180px]">Feature</th>
                  <th className="p-4 text-signal font-bold text-center whitespace-nowrap">
                    ⚡ FLUX
                  </th>
                  <th className="p-4 text-gray-400 font-semibold text-center whitespace-nowrap">Falstad</th>
                  <th className="p-4 text-gray-400 font-semibold text-center whitespace-nowrap">Logisim</th>
                  <th className="p-4 text-gray-400 font-semibold text-center whitespace-nowrap">Tinkercad</th>
                  <th className="p-4 text-gray-400 font-semibold text-center whitespace-nowrap">EasyEDA</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-gray-800/50 ${i % 2 === 0 ? 'bg-gray-900/20' : ''}`}
                  >
                    <td className="p-4 text-gray-300 font-medium">{row.feature}</td>
                    {[row.flux, row.falstad, row.logisim, row.tinkercad, row.easyeda].map((v, j) => (
                      <td key={j} className="p-4 text-center">
                        {v
                          ? <Check className="w-5 h-5 text-green-400 mx-auto" />
                          : <X    className="w-5 h-5 text-gray-700 mx-auto"  />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-gray-600 mt-4">
            * Also studied: CircuitJS, EveryCircuit, Multisim, KiCad — see "Inspired by" section below.
          </p>
        </div>
      </section>

      {/* ── Platforms Studied ────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge color="purple" className="mb-4 text-sm px-4 py-1.5">Research-Backed</Badge>
            <h2 className="text-4xl font-bold mb-4">Inspired by the Best. Built Better.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We spent hundreds of hours studying 8 leading circuit platforms. Every feature in FLUX
              was informed by their strengths — and designed to overcome their limitations.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORMS.map(p => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-signal/40 hover:bg-gray-900/80 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-bold text-white group-hover:text-signal transition-colors">
                    {p.name}
                  </span>
                  <Badge color="gray" className="text-xs">{p.tag}</Badge>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{p.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Loved by Learners</h2>
            <p className="text-gray-500">Real feedback from students, teachers, and engineers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-signal to-purple-500 flex items-center justify-center font-bold text-black text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{t.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Source Section ──────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge color="green" className="mb-4 text-sm px-4 py-1.5">Open Source Forever</Badge>
            <h2 className="text-4xl font-bold mb-4">Free. As In Freedom.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              FLUX is MIT-licensed and will always be 100% free. No Pro plan. No Classroom plan.
              No upsells. Education should never be behind a paywall.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '⚡', title: 'Zero Cost',         desc: 'Every feature, every component, every AI hint — free for every person on earth, forever.' },
              { icon: '🔓', title: 'MIT Licensed',      desc: 'Fork it. Embed it. Build a product with it. No restrictions. The code is yours.' },
              { icon: '🌍', title: 'Community-Driven',  desc: 'Contributions welcome. File issues, submit PRs, request features — this is your simulator.' },
            ].map(item => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center hover:border-green-700/50 transition-colors"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-8 md:p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(124,58,237,0.08) 100%)',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold mb-3">Star us on GitHub</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              If FLUX helps you learn, teach, or build — a star means the world to us. It helps
              others discover the project and keeps the community growing.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <GitHubStarButton size="md" />
              <a
                href="https://github.com/mevan101/Fluxapp/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-600 bg-transparent text-gray-300 text-base font-medium hover:border-gray-400 hover:text-white transition-colors"
              >
                <GitFork className="w-5 h-5" />
                Contribute
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-950/50">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(124,58,237,0.15) 100%)',
            border: '1px solid rgba(0,212,255,0.3)',
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to build?</h2>
          <p className="text-gray-400 mb-2 text-lg">
            No account. No credit card. Open the simulator and start immediately.
          </p>
          <p className="text-gray-600 text-sm mb-8">
            Join engineers and students around the world who switched to FLUX.
          </p>
          <Link to="/simulator">
            <Button size="lg" variant="primary" className="gap-2">
              Open Simulator <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-signal font-mono font-bold text-lg">
              <Zap className="w-5 h-5 fill-signal" /> FLUX
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap justify-center">
              <Link to="/simulator" className="hover:text-white transition-colors">Simulator</Link>
              <Link to="/gallery"   className="hover:text-white transition-colors">Gallery</Link>
              <Link to="/classroom" className="hover:text-white transition-colors">Classroom</Link>
              <a
                href="https://github.com/mevan101/Fluxapp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/mevan101/Fluxapp/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                MIT License
              </a>
            </div>
            <GitHubStarButton />
          </div>
          <div className="mt-6 text-center text-gray-700 text-xs">
            © {new Date().getFullYear()} FLUX. Open source. MIT Licensed. Built with ❤️ for the electronics community.
          </div>
        </div>
      </footer>
    </div>
  )
}

