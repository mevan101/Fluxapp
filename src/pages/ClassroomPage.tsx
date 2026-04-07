import { useState } from 'react'
import { Users, Plus, Settings, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const CLASSROOMS = [
  { id: 1, name: 'Digital Logic 101', students: 24, lastActivity: '2h ago', progress: 72, joinCode: 'DL101-X7' },
  { id: 2, name: 'Computer Architecture', students: 18, lastActivity: '1d ago', progress: 45, joinCode: 'CA-9K2' },
  { id: 3, name: 'Intro to Electronics', students: 31, lastActivity: '3h ago', progress: 58, joinCode: 'IE-4M8' },
]

const STUDENTS = [
  { name: 'Alice Johnson', status: 'active', progress: 85, lastActive: '2 min ago' },
  { name: 'Bob Chen', status: 'active', progress: 72, lastActive: '5 min ago' },
  { name: 'Carol Davis', status: 'idle', progress: 60, lastActive: '20 min ago' },
  { name: 'David Kim', status: 'offline', progress: 45, lastActive: '2h ago' },
  { name: 'Emma Wilson', status: 'active', progress: 91, lastActive: '1 min ago' },
  { name: 'Frank Lee', status: 'idle', progress: 38, lastActive: '35 min ago' },
  { name: 'Grace Park', status: 'active', progress: 79, lastActive: '8 min ago' },
  { name: 'Henry Brown', status: 'offline', progress: 22, lastActive: '1d ago' },
]

const ASSIGNMENTS = [
  { name: 'Lab 1: Basic Gates', due: 'Nov 15', completion: 96 },
  { name: 'Lab 2: Combinational Logic', due: 'Nov 22', completion: 74 },
  { name: 'Lab 3: Flip-Flops & Latches', due: 'Dec 1', completion: 31 },
]

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: 'bg-green-400', label: 'Active' },
  idle: { color: 'bg-yellow-400', label: 'Idle' },
  offline: { color: 'bg-gray-600', label: 'Offline' },
}

function ClassroomView({ classroom }: { classroom: typeof CLASSROOMS[0] }) {
  const [tab, setTab] = useState<'students' | 'assignments' | 'analytics'>('students')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{classroom.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-gray-500 text-sm">{classroom.students} students</span>
            <Badge color="cyan" className="font-mono">Join: {classroom.joinCode}</Badge>
          </div>
        </div>
        <Button variant="secondary" className="gap-2"><Settings className="w-4 h-4" /> Settings</Button>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-800">
        {(['students', 'assignments', 'analytics'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-signal text-signal' : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'students' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left pb-3">Student</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Progress</th>
                <th className="text-left pb-3">Last Active</th>
                <th className="text-left pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {STUDENTS.map(s => (
                <tr key={s.name} className="hover:bg-gray-900/50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-200">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s.status].color}`} />
                      <span className="text-xs text-gray-400">{STATUS_CONFIG[s.status].label}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-signal"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-gray-500">{s.lastActive}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs py-1">View Canvas</Button>
                      <Button variant="ghost" size="sm" className="text-xs py-1 text-purple-400 hover:text-purple-300">Push Hint</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'assignments' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Assignments</h3>
            <Button size="sm" className="gap-1"><Plus className="w-3.5 h-3.5" /> Create Assignment</Button>
          </div>
          <div className="space-y-3">
            {ASSIGNMENTS.map(a => (
              <Card key={a.name} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" /> Due {a.due}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-signal font-mono">{a.completion}%</div>
                  <div className="text-xs text-gray-500">complete</div>
                  <div className="w-24 bg-gray-800 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-signal" style={{ width: `${a.completion}%` }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center p-6">
              <div className="text-4xl font-black text-signal font-mono">73%</div>
              <div className="text-gray-500 text-sm mt-1">Class Average</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-black text-yellow-400 font-mono">4.2h</div>
              <div className="text-gray-500 text-sm mt-1">Avg Sim Time</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-black text-green-400 font-mono">18</div>
              <div className="text-gray-500 text-sm mt-1">Circuits Built</div>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-signal" /> Weekly Simulation Time (hours)
            </h3>
            <svg width="100%" height="100" viewBox="0 0 400 100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const heights = [60, 80, 45, 90, 75, 30, 20]
                const h = heights[i]
                const x = i * 55 + 15
                return (
                  <g key={day}>
                    <rect x={x} y={100 - h} width={35} height={h} rx="4" fill="#00d4ff" opacity="0.6" />
                    <text x={x + 17} y={98} textAnchor="middle" fill="#6b7280" fontSize="10">{day}</text>
                  </g>
                )
              })}
            </svg>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400" /> Common Mistakes
            </h3>
            <ul className="space-y-2">
              {[
                'Connecting output-to-output pins (12 students)',
                'Forgetting clock connection for flip-flops (8 students)',
                'NOT gate inverted incorrectly (5 students)',
              ].map(m => (
                <li key={m} className="flex items-start gap-2 text-sm text-gray-400">
                  <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  {m}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function ClassroomPage() {
  const [selected, setSelected] = useState<typeof CLASSROOMS[0] | null>(null)

  if (selected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-gray-500 hover:text-white mb-6 flex items-center gap-1"
        >
          ← My Classrooms
        </button>
        <ClassroomView classroom={selected} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Classrooms</h1>
          <p className="text-gray-500 mt-1">Manage your classes and track student progress</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Create Class</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {CLASSROOMS.map(c => (
          <Card key={c.id} className="hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{c.name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                  <Users className="w-3.5 h-3.5" />
                  {c.students} students
                </div>
              </div>
              <Badge color="gray">{c.lastActivity}</Badge>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Class Progress</span>
                <span>{c.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="h-2 rounded-full bg-signal" style={{ width: `${c.progress}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-600 font-mono">
                <span>Code:</span>
                <span className="text-gray-400">{c.joinCode}</span>
              </div>
              <Button size="sm" onClick={() => setSelected(c)}>Open</Button>
            </div>
          </Card>
        ))}

        <div
          className="border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center p-8 hover:border-gray-600 transition-colors cursor-pointer group"
          onClick={() => {}}
        >
          <Plus className="w-8 h-8 text-gray-700 group-hover:text-gray-500 transition-colors mb-2" />
          <span className="text-gray-600 group-hover:text-gray-400 text-sm transition-colors">Create New Class</span>
        </div>
      </div>
    </div>
  )
}
