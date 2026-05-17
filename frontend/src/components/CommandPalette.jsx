import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Target, Trophy, Users,
  TrendingUp, ShieldCheck, RefreshCcw, BarChart3,
  ScrollText, FileBarChart, AlertTriangle, GitBranch,
  Activity, ArrowRight, X, Keyboard
} from 'lucide-react';

const ACTIONS = [
  { id: 1,  label: 'Employee Dashboard',    icon: LayoutDashboard, path: '/employee/dashboard',        group: 'Employee', accent: 'indigo'  },
  { id: 2,  label: 'My Goals',              icon: Target,          path: '/employee/goals',             group: 'Employee', accent: 'cyan'    },
  { id: 3,  label: 'Log Achievement',       icon: Trophy,          path: '/employee/achievement',       group: 'Employee', accent: 'emerald' },
  { id: 4,  label: 'Team Dashboard',        icon: Users,           path: '/manager/dashboard',          group: 'Manager',  accent: 'violet'  },
  { id: 5,  label: 'Manager Effectiveness', icon: TrendingUp,      path: '/manager/effectiveness',      group: 'Manager',  accent: 'violet'  },
  { id: 6,  label: 'Admin Control Center',  icon: ShieldCheck,     path: '/admin/dashboard',            group: 'Admin',    accent: 'rose'    },
  { id: 7,  label: 'Cycle Manager',         icon: RefreshCcw,      path: '/admin/cycles',               group: 'Admin',    accent: 'cyan'    },
  { id: 8,  label: 'Reports',               icon: FileBarChart,    path: '/admin/reports',              group: 'Admin',    accent: 'emerald' },
  { id: 9,  label: 'Audit Log',             icon: ScrollText,      path: '/admin/audit',                group: 'Admin',    accent: 'violet'  },
  { id: 10, label: 'Analytics',             icon: BarChart3,       path: '/admin/analytics',            group: 'Admin',    accent: 'indigo'  },
  { id: 11, label: 'Escalation Log',        icon: AlertTriangle,   path: '/admin/escalations',          group: 'Admin',    accent: 'rose'    },
  { id: 12, label: 'Escalation Ops',        icon: Activity,        path: '/admin/escalation-dashboard', group: 'Admin',    accent: 'rose'    },
  { id: 13, label: 'Dept. Comparison',      icon: Users,           path: '/admin/departments',          group: 'Admin',    accent: 'amber'   },
  { id: 14, label: 'Goal Dependency Graph', icon: GitBranch,       path: '/admin/dependencies',         group: 'Admin',    accent: 'cyan'    },
];

const ACCENT = {
  indigo:  'text-indigo-400  bg-indigo-500/10',
  cyan:    'text-cyan-400    bg-cyan-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  violet:  'text-violet-400  bg-violet-500/10',
  rose:    'text-rose-400    bg-rose-500/10',
  amber:   'text-amber-400   bg-amber-500/10',
};

export default function CommandPalette() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [query,     setQuery]     = useState('');
  const [selected,  setSelected]  = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setIsOpen(o => !o); setQuery(''); setSelected(0); }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = ACTIONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.group.toLowerCase().includes(query.toLowerCase())
  );

  const grouped      = filtered.reduce((acc, a) => { if (!acc[a.group]) acc[a.group] = []; acc[a.group].push(a); return acc; }, {});
  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    const handleArrow = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flatFiltered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && flatFiltered[selected]) { navigate(flatFiltered[selected].path); setIsOpen(false); }
    };
    window.addEventListener('keydown', handleArrow);
    return () => window.removeEventListener('keydown', handleArrow);
  }, [isOpen, selected, flatFiltered, navigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          style={{ background: 'rgba(5,9,20,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            key="cmd-panel"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-xl rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(9,14,28,0.98)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(99,102,241,0.22)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.05]">
              <Search className="w-4.5 h-4.5 text-slate-500 shrink-0" />
              <input
                autoFocus
                type="text"
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
                placeholder="Search pages, actions..."
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
              />
              {query && (
                <motion.button
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  onClick={() => setQuery('')}
                  className="p-1 rounded text-slate-600 hover:text-slate-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/6 text-slate-600 border border-white/8">Esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2 px-2">
              {flatFiltered.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-600">
                  No results for "<span className="text-slate-400">{query}</span>"
                </div>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group} className="mb-3">
                    <div className="px-3 mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-widest">{group}</div>
                    {items.map((action) => {
                      const globalIdx = flatFiltered.indexOf(action);
                      const a = ACCENT[action.accent] || ACCENT.indigo;
                      const isSelected = globalIdx === selected;
                      return (
                        <motion.button
                          key={action.id}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.1 }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group border ${
                            isSelected ? 'bg-indigo-500/10 border-indigo-500/25' : 'hover:bg-white/4 border-transparent'
                          }`}
                          onClick={() => { navigate(action.path); setIsOpen(false); }}
                          onMouseEnter={() => setSelected(globalIdx)}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a}`}>
                            <action.icon className="w-4 h-4" />
                          </span>
                          <span className="flex-1 text-sm font-medium text-slate-300">{action.label}</span>
                          <ArrowRight className={`w-3.5 h-3.5 transition-all ${
                            isSelected ? 'text-indigo-400 opacity-100 translate-x-0.5' : 'opacity-0'
                          }`} />
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.05] px-4 py-2.5 flex items-center gap-4">
              <Keyboard className="w-3.5 h-3.5 text-slate-700" />
              <div className="flex gap-4 text-[11px] text-slate-700">
                {[['↑↓', 'Navigate'], ['↵', 'Select'], ['Esc', 'Close']].map(([key, label]) => (
                  <span key={key} className="flex items-center gap-1.5">
                    <kbd className="font-mono px-1.5 py-0.5 bg-white/6 border border-white/8 rounded text-slate-500 text-[10px]">{key}</kbd>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
