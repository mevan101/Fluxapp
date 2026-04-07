import { Link } from 'react-router-dom'
import { Zap, Clock, Cpu, Flame, Trophy, Lock, CheckCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const STATS = [
  { label: 'Circuits Built', value: '23', icon: <Cpu className="w-5 h-5 text-signal" /> },
  { label: 'Components Used', value: '847', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
  { label: 'Sim Time', value: '14.3h', icon: <Clock className="w-5 h-5 text-purple-400" /> },
  { label: 'Streak', value: '14 days 🔥', icon: <Flame className="w-5 h-5 text-orange-400" /> },
]

const RECENT_CIRCUITS = [
  { name: '4-bit Ripple Adder', modified: '2h ago', components: 24, id: 1 },
  { name: 'SR Latch', modified: '1d ago', components: 8, id: 2 },
  { name: 'Ring Oscillator', modified: '3d ago', components: 6, id: 3 },
  { name: 'Half Adder', modified: '5d ago', components: 9, id: 4 },
]

const LEADERBOARD = [
  { rank: 1, name: 'Elena V.', xp: 12450, medal: '🥇' },
  { rank: 2, name: 'Marcus T.', xp: 11200, medal: '🥈' },
  { rank: 3, name: 'Alex (you)', xp: 3450, medal: '🥉' },
  { rank: 4, name: 'Priya N.', xp: 3100, medal: '' },
  { rank: 5, name: 'Sam K.', xp: 2900, medal: '' },
]

const ACHIEVEMENTS = [
  { name: 'First Circuit', unlocked: true, icon: '⚡' },
  { name: 'Wire Master', unlocked: true, icon: '🔌' },
  { name: 'Gate Guru', unlocked: true, icon: '🧠' },
  { name: 'Flip Flop Fan', unlocked: false, icon: '🔄' },
  { name: 'CPU Builder', unlocked: false, icon: '🖥️' },
  { name: 'Speed Demon', unlocked: false, icon: '🚀' },
]

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, Alex! 👋</h1>
        <p className="text-gray-500 mt-1">Keep building — you're on a 14-day streak!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <Card key={s.label} className="flex items-center gap-3">
            {s.icon}
            <div>
              <div className="text-xl font-bold font-mono text-white">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* XP Progress */}
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Level 7</div>
              <div className="text-lg font-bold text-signal font-mono">Circuit Architect</div>
            </div>
            <Badge color="cyan">3,450 / 4,000 XP</Badge>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-signal to-cyan-300"
              style={{ width: `${(3450 / 4000) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">550 XP to Level 8 · Digital Wizard</p>
        </Card>

        {/* Daily Challenge */}
        <Card glow>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Daily Challenge</span>
            <Badge color="yellow">+150 XP</Badge>
          </div>
          <h3 className="font-bold text-white mb-1">Fix the Broken Oscillator</h3>
          <p className="text-xs text-gray-500 mb-3">Find and fix the broken connection in the ring oscillator.</p>
          <div className="text-sm font-mono text-orange-400 mb-3">⏰ 23:45:12 left</div>
          <Link to="/simulator">
            <Button size="sm" className="w-full">Start Challenge</Button>
          </Link>
        </Card>
      </div>

      {/* Learning Path */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Path</div>
            <h3 className="font-bold text-white">Digital Logic 101</h3>
          </div>
          <Badge color="green">7 / 10 labs</Badge>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
          <div className="h-2 rounded-full bg-green-500" style={{ width: '70%' }} />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['Intro', 'AND/OR', 'NOT', 'Combinational', 'Adders', 'Latches', 'Flip-Flops', 'Counters', 'FSMs', 'Final'].map((lab, i) => (
            <div
              key={lab}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                i < 7 ? 'bg-green-900/40 text-green-300' : 'bg-gray-800 text-gray-600'
              }`}
            >
              {i < 7 ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {lab}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Recent Circuits */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-signal" /> Recent Circuits
          </h2>
          <div className="space-y-2">
            {RECENT_CIRCUITS.map(c => (
              <Card key={c.id} className="flex items-center justify-between p-3 hover:border-gray-600 transition-colors">
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.components} components · {c.modified}</div>
                </div>
                <Link to="/simulator">
                  <Button variant="ghost" size="sm">Open</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Leaderboard
          </h2>
          <Card className="divide-y divide-gray-800">
            {LEADERBOARD.map(entry => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-3 ${entry.name.includes('you') ? 'bg-signal/5' : ''}`}
              >
                <div className="w-6 text-center text-sm font-mono text-gray-500">{entry.rank}</div>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                  {entry.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${entry.name.includes('you') ? 'text-signal' : 'text-gray-200'}`}>
                    {entry.name}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{entry.xp.toLocaleString()} XP</div>
                </div>
                <div className="text-lg">{entry.medal}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-bold mb-3">Achievements</h2>
        <div className="flex gap-4 flex-wrap">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.name}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                a.unlocked
                  ? 'border-signal/40 bg-signal/5 shadow-md shadow-signal/10'
                  : 'border-gray-800 bg-gray-900/50 opacity-50'
              }`}
              title={a.name}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className={`text-xs font-medium ${a.unlocked ? 'text-signal' : 'text-gray-600'}`}>
                {a.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
