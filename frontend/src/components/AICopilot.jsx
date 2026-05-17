import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, ChevronDown, Zap, BarChart2, Users } from 'lucide-react';

const SUGGESTIONS = [
  { icon: Sparkles, label: 'Suggest Q4 goals',     query: 'suggest goals for q4' },
  { icon: BarChart2, label: 'Team performance',     query: 'show my team performance' },
  { icon: Users,     label: 'Compare departments',  query: 'compare departments' },
];

const AI_RESPONSES = {
  suggest: `Based on your department (Engineering) and current organizational thrust areas, here are **AI-powered Q4 goal recommendations**:\n\n🎯 **Reduce deployment cycle time by 25%**\n   Thrust: Innovation · Weight: 25%\n\n🛡️ **Achieve 95% unit test coverage**\n   Thrust: Quality · Weight: 20%\n\n🚀 **Migrate 3 legacy services to containers**\n   Thrust: Efficiency · Weight: 30%\n\nWould you like me to pre-fill any of these into your goal form?`,
  performance: `Your team's Q3 performance summary:\n\n📊 **Completion Rate:** 87% *(↑ 4% vs Q2)*\n⏱ **Avg Goal Turnaround:** 1.8 days\n🔴 **At-Risk Goals:** 2 (Revenue Target, Cloud Migration)\n✅ **Top Performer:** Mike Chen *(100% on-time)*\n\n⚠️ **Recommendation:** Schedule a check-in with Emma Wilson — her rework rate is 2x the team average.`,
  department: `Department comparison for Q3 2025:\n\n🥇 **HR:** 95% completion\n🥈 **Sales:** 90% completion\n🥉 **Marketing:** 84% completion\n⚠️ **Engineering:** 76% completion\n🔴 **Logistics:** 65% completion *(↓ 23% vs Q1)*\n\nHistorical patterns suggest Logistics drop correlates with supply chain disruptions.`,
  default: `I can help with:\n\n• **"Suggest goals for Q4"** — AI-powered recommendations\n• **"Show my team performance"** — Analytics summary\n• **"Compare departments"** — Benchmarking\n• **"What goals are at risk?"** — Risk forecasting\n\nJust type your question naturally!`,
};

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm the **AtomQuest AI Copilot** — powered by enterprise intelligence.\n\nI can help you draft goals, analyze performance, identify risks, and navigate the system.` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (text) => {
    const q = (text || input).trim();
    if (!q) return;

    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const lower = q.toLowerCase();
      const response =
        lower.includes('suggest') || lower.includes('goal') || lower.includes('q4') ? AI_RESPONSES.suggest :
        lower.includes('performance') || lower.includes('team') || lower.includes('summary') ? AI_RESPONSES.performance :
        lower.includes('department') || lower.includes('compare') || lower.includes('q3') ? AI_RESPONSES.department :
        AI_RESPONSES.default;

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsThinking(false);
    }, 1000 + Math.random() * 800);
  };

  /* ── Floating trigger ── */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-20 right-6 z-50
          w-12 h-12 rounded-2xl
          gradient-indigo-violet text-white
          shadow-[0_8px_25px_rgba(99,102,241,0.5)]
          hover:shadow-[0_12px_35px_rgba(99,102,241,0.6)]
          hover:scale-110 transition-all duration-300
          flex items-center justify-center group
        "
        aria-label="Open AI Copilot"
      >
        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`
      copilot-panel
      fixed right-6 z-50
      w-[400px] rounded-2xl overflow-hidden
      flex flex-col
      animate-slide-right
      transition-all duration-300
      ${isMinimized ? 'bottom-6 h-14' : 'bottom-6 h-[520px]'}
    `}>
      {/* ── Header ── */}
      <div className="
        flex items-center justify-between px-4 py-3.5 shrink-0
        border-b border-white/6
        bg-gradient-to-r from-indigo-500/10 to-violet-500/8
      ">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl gradient-indigo-violet flex items-center justify-center shadow-indigo shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">AI Copilot</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-medium">AtomQuest Intelligence</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg gradient-indigo-violet flex items-center justify-center shrink-0 mt-1 mr-2">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`
                  max-w-[82%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed
                  ${m.role === 'user'
                    ? 'gradient-indigo-violet text-white rounded-br-sm shadow-indigo'
                    : 'bg-white/5 border border-white/6 text-slate-300 rounded-bl-sm'
                  }
                `}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Thinking dots */}
            {isThinking && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-6 h-6 rounded-lg gradient-indigo-violet flex items-center justify-center shrink-0 mt-1 mr-2">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white/5 border border-white/6 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    {[0,1,2].map(d => (
                      <div
                        key={d}
                        className="w-2 h-2 rounded-full bg-indigo-400"
                        style={{ animation: `dotBounce 1.4s ease-in-out ${d * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggestion chips ── */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.query)}
                className="
                  flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  bg-white/4 border border-white/6 hover:bg-indigo-500/10 hover:border-indigo-500/25
                  text-xs text-slate-400 hover:text-indigo-300
                  whitespace-nowrap transition-all duration-200 shrink-0
                "
              >
                <s.icon className="w-3 h-3" />
                {s.label}
              </button>
            ))}
          </div>

          {/* ── Input ── */}
          <div className="px-3 pb-3 shrink-0">
            <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 focus-within:border-indigo-500/40 focus-within:bg-indigo-500/5 transition-all">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="
                  flex-1 bg-transparent text-sm text-slate-200
                  placeholder-slate-600 outline-none
                "
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="
                  p-1.5 rounded-lg gradient-indigo-violet text-white
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:shadow-indigo transition-all duration-200
                  shrink-0
                "
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
