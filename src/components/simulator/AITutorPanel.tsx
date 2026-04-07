import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Bot, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  text: string
}

const RESPONSES: [RegExp, string][] = [
  [/and gate|what is and/i, 'An AND gate outputs 1 only when ALL inputs are 1. Think of it like switches in series — both must be ON for current to flow.'],
  [/or gate|what is or/i, 'An OR gate outputs 1 when ANY input is 1. Think of switches in parallel.'],
  [/not gate|inverter/i, 'A NOT gate (inverter) flips the signal. Input 0 → Output 1. Input 1 → Output 0.'],
  [/xor/i, 'XOR (exclusive OR) outputs 1 when inputs are DIFFERENT. 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0.'],
  [/nand/i, 'NAND is NOT AND. It outputs 0 only when ALL inputs are 1. NAND gates are universal — you can build any circuit from them!'],
  [/nor/i, 'NOR is NOT OR. It outputs 0 if ANY input is 1. NOR gates are also universal.'],
  [/flip.?flop|flipflop|dff/i, 'A flip-flop is a 1-bit memory element. The D flip-flop captures its D input on each rising clock edge and holds that value until the next clock.'],
  [/led.*light|why.*led|led.*not/i, 'Check these: 1) Is your Switch set to ON (1)? 2) Are all wires connected? 3) Make sure you connect from output pins (right side) to input pins (left side). 4) Click ▶ Play to start simulation.'],
  [/clock/i, 'The CLOCK component toggles between 0 and 1 automatically when the simulation is running. Connect it to flip-flop CLK inputs.'],
  [/mux|multiplexer/i, 'A MUX (multiplexer) selects one of multiple inputs. For MUX 2:1: if S=0, output = I0; if S=1, output = I1.'],
  [/adder/i, 'An adder computes binary addition. A Half Adder adds two bits (A+B). A Full Adder adds three bits (A+B+Cin) and handles carry-in.'],
  [/wire|connect/i, 'To wire components: click on an output pin (right side, cyan dot), then click on an input pin (left side). Wires glow cyan when carrying signal 1!'],
  [/help|commands/i, 'Try asking: "explain AND gate", "what is a flip flop", "how to wire components", "why doesn\'t my LED light up", "what is XOR"'],
  [/place|add component/i, 'To add components: click a component in the left panel, then click on the canvas to place it. Press Escape to cancel.'],
]

const SUGGESTIONS = ['Explain AND gate', 'Why doesn\'t my LED light up?', 'What is a flip-flop?']

function getResponse(input: string): string {
  for (const [pattern, response] of RESPONSES) {
    if (pattern.test(input)) return response
  }
  return "Great question! Try connecting components and toggling switches to see how signals propagate. Ask me about specific gates or components!"
}

interface AITutorPanelProps {
  componentCount: number
  wireCount: number
}

export default function AITutorPanel({ componentCount, wireCount }: AITutorPanelProps) {
  const [open, setOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I\'m your AI tutor. Ask me anything about digital logic circuits!' },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  function send(text?: string) {
    const msg = text ?? input
    if (!msg.trim()) return
    const userMsg: Message = { role: 'user', text: msg }
    const aiMsg: Message = { role: 'ai', text: getResponse(msg) }
    setMessages(prev => [...prev, userMsg, aiMsg])
    setInput('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const contextHint = componentCount === 0
    ? '💡 Start by clicking a component in the left panel to place it on the canvas.'
    : wireCount === 0
    ? '💡 Now connect components by clicking output pins → input pins.'
    : null

  return (
    <div
      className={`flex flex-col bg-gray-950 border-l border-gray-800 transition-all duration-200 ${open ? 'w-72' : 'w-10'}`}
      style={{ minHeight: 0 }}
    >
      <div className="flex items-center justify-between px-2 py-2 border-b border-gray-800 flex-shrink-0">
        {open && (
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">AI Tutor</span>
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="text-gray-500 hover:text-white ml-auto"
        >
          {open ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <>
          <div className="flex gap-1 p-2 border-b border-gray-800 flex-wrap">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-2 py-1 bg-purple-900/40 text-purple-300 rounded hover:bg-purple-800/60 border border-purple-800 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {contextHint && (
            <div className="mx-2 mt-2 p-2 bg-purple-900/20 border border-purple-800 rounded text-xs text-purple-200">
              {contextHint}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] text-xs rounded-lg px-3 py-2 ${
                    m.role === 'user'
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  {m.role === 'ai' && <Bot className="w-3 h-3 text-purple-400 inline mr-1" />}
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-2 border-t border-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => send()}
              className="p-1.5 bg-purple-600 hover:bg-purple-500 rounded text-white transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
