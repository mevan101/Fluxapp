import { Link } from 'react-router-dom'
import { Zap, Brain, Users, Check, X, Star, ArrowRight, Cpu, BookOpen, Globe } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const FEATURES = [
  {
    icon: <Cpu className="w-8 h-8 text-signal" />,
    title: 'Visual Circuit Builder',
    desc: 'Drag and drop 60+ components onto an infinite canvas. Real-time simulation shows signal propagation instantly.',
    badge: 'Core',
    color: 'cyan',
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    title: 'AI Learning Tutor',
    desc: 'Stuck? Ask FLUX AI anything. Get smart hints, concept explanations, and guided walkthroughs.',
    badge: 'AI-Powered',
    color: 'purple',
  },
  {
    icon: <Globe className="w-8 h-8 text-green-400" />,
    title: 'Community Gallery',
    desc: 'Browse thousands of shared circuits. Fork, remix, and learn from the community.',
    badge: 'Social',
    color: 'green',
  },
]

const COMPARISON = [
  { feature: 'Modern UI/UX', flux: true, falstad: false, logisim: false, circuitjs: false },
  { feature: 'AI Tutor', flux: true, falstad: false, logisim: false, circuitjs: false },
  { feature: 'Mobile Friendly', flux: true, falstad: false, logisim: false, circuitjs: false },
  { feature: 'Dark Mode', flux: true, falstad: false, logisim: false, circuitjs: false },
  { feature: 'Logic Gates', flux: true, falstad: true, logisim: true, circuitjs: true },
  { feature: 'Flip Flops', flux: true, falstad: true, logisim: true, circuitjs: false },
  { feature: 'Community Gallery', flux: true, falstad: false, logisim: false, circuitjs: false },
  { feature: 'Classroom Tools', flux: true, falstad: false, logisim: false, circuitjs: false },
  { feature: 'Free Forever', flux: true, falstad: true, logisim: true, circuitjs: true },
]

const TESTIMONIALS = [
  {
    initials: 'SK',
    name: 'Sarah K.',
    role: 'EE Student at MIT',
    quote: 'FLUX made me understand flip-flops in 10 minutes. The AI tutor walked me through it step by step.',
    stars: 5,
  },
  {
    initials: 'JM',
    name: 'James M.',
    role: 'High School CS Teacher',
    quote: 'I use FLUX in my classroom every day. The real-time signal visualization is incredible for teaching.',
    stars: 5,
  },
  {
    initials: 'AR',
    name: 'Anika R.',
    role: 'Hardware Engineer',
    quote: 'Finally a circuit simulator that doesn\'t feel like it was built in 1998. Clean, fast, and powerful.',
    stars: 5,
  },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['Unlimited circuits', '60+ components', 'Community gallery', 'Basic AI hints'],
    popular: false,
    color: 'border-gray-700',
    btn: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '$4',
    period: '/month',
    features: ['Everything in Free', 'Unlimited AI tutor', 'Private circuits', 'Export to PDF/SVG', 'Priority support'],
    popular: true,
    color: 'border-signal',
    btn: 'Start Free Trial',
  },
  {
    name: 'Classroom',
    price: '$5',
    period: '/student/mo',
    features: ['Everything in Pro', 'Class management', 'Assignment tools', 'Analytics dashboard', 'LMS integration'],
    popular: false,
    color: 'border-purple-600',
    btn: 'Contact Sales',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-canvas text-gray-100 overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(0,212,255,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge color="cyan" className="mb-6 text-sm px-4 py-1.5">
            🚀 Beta — Now Open to Everyone
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
            The Circuit & Logic Simulator<br />the World Deserves
          </p>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Design, simulate, and learn digital electronics with AI-powered guidance.
            No downloads. No setup. Just circuits.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <Link to="/simulator">
              <Button size="lg" variant="primary" className="gap-2">
                Start Building Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="secondary">
              ▶ Watch Demo
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { label: '60+ Components', sub: 'gates, flops & more' },
              { label: 'AI-Powered', sub: 'smart tutor built-in' },
              { label: 'Real-time Sim', sub: 'instant propagation' },
              { label: 'Free Forever', sub: 'no credit card needed' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-signal font-bold text-lg font-mono">{s.label}</div>
                <div className="text-gray-500 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-lg">Built for students, engineers, and educators alike.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map(f => (
            <Card key={f.title} glow={f.color === 'cyan'} className="p-8 hover:border-gray-600 transition-colors">
              <div className="mb-4">{f.icon}</div>
              <Badge color={f.color as 'cyan' | 'purple' | 'green'} className="mb-3">{f.badge}</Badge>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-4 bg-gray-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How We Compare</h2>
            <p className="text-gray-400">FLUX vs the alternatives</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="text-left p-4 text-gray-300 font-semibold">Feature</th>
                  <th className="p-4 text-signal font-bold text-center">FLUX</th>
                  <th className="p-4 text-gray-400 font-semibold text-center">Falstad</th>
                  <th className="p-4 text-gray-400 font-semibold text-center">Logisim</th>
                  <th className="p-4 text-gray-400 font-semibold text-center">CircuitJS</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-800/50 ${i % 2 === 0 ? 'bg-gray-900/20' : ''}`}>
                    <td className="p-4 text-gray-300">{row.feature}</td>
                    {[row.flux, row.falstad, row.logisim, row.circuitjs].map((v, j) => (
                      <td key={j} className="p-4 text-center">
                        {v
                          ? <Check className="w-5 h-5 text-green-400 mx-auto" />
                          : <X className="w-5 h-5 text-gray-600 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Loved by Learners</h2>
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

      {/* Pricing */}
      <section className="py-24 px-4 bg-gray-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map(p => (
              <div
                key={p.name}
                className={`relative rounded-xl border-2 p-6 bg-gray-900 flex flex-col ${p.color}`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge color="cyan" className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-black text-white">{p.price}</span>
                    <span className="text-gray-500 text-sm pb-1">{p.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/simulator">
                  <Button variant={p.popular ? 'primary' : 'secondary'} className="w-full">
                    {p.btn}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(124,58,237,0.15) 100%)',
            border: '1px solid rgba(0,212,255,0.3)',
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to build?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join thousands of engineers and students already using FLUX.</p>
          <Link to="/simulator">
            <Button size="lg" variant="primary" className="gap-2">
              Open Simulator <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2 text-signal font-mono font-bold">
          <Zap className="w-4 h-4" /> FLUX
        </div>
        © 2024 FLUX. Open source. Built with ❤️ for the electronics community.
      </footer>
    </div>
  )
}
