import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Target, Trophy, Users, TrendingUp,
  ShieldCheck, RefreshCcw, BarChart3, ScrollText, FileBarChart,
  AlertTriangle, GitBranch, Activity, ChevronRight, Atom, LogOut
} from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = {
  EMPLOYEE: [
    { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'indigo' },
    { to: '/employee/goals',     label: 'My Goals',  icon: Target,           accent: 'cyan' },
    { to: '/employee/achievement', label: 'Achievements', icon: Trophy,      accent: 'emerald' },
  ],
  MANAGER: [
    { to: '/manager/dashboard',    label: 'Team Dashboard', icon: LayoutDashboard, accent: 'indigo' },
    { to: '/manager/effectiveness', label: 'Effectiveness', icon: TrendingUp,      accent: 'violet' },
  ],
  ADMIN: [
    { to: '/admin/dashboard',         label: 'Control Center',    icon: LayoutDashboard, accent: 'indigo' },
    { to: '/admin/cycles',            label: 'Cycle Manager',     icon: RefreshCcw,      accent: 'cyan' },
    { to: '/admin/reports',           label: 'Reports',           icon: FileBarChart,    accent: 'emerald' },
    { to: '/admin/audit',             label: 'Audit Log',         icon: ScrollText,      accent: 'violet' },
    { to: '/admin/analytics',         label: 'Analytics',         icon: BarChart3,       accent: 'indigo' },
    { to: '/admin/escalations',       label: 'Escalation Log',   icon: AlertTriangle,   accent: 'rose' },
    { to: '/admin/escalation-dashboard', label: 'Escalation Ops', icon: Activity,       accent: 'rose' },
    { to: '/admin/departments',       label: 'Dept. Comparison',  icon: Users,           accent: 'amber' },
    { to: '/admin/dependencies',      label: 'Goal Graph',        icon: GitBranch,       accent: 'cyan' },
  ],
};

const ACCENT_COLORS = {
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', active: 'bg-indigo-500/15 border-indigo-500/30' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   active: 'bg-cyan-500/10 border-cyan-500/30' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10',border: 'border-emerald-500/25',active: 'bg-emerald-500/10 border-emerald-500/25' },
  violet:  { icon: 'text-violet-400',  bg: 'bg-violet-500/10', border: 'border-violet-500/25', active: 'bg-violet-500/15 border-violet-500/30' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-500/10',   border: 'border-rose-500/25',   active: 'bg-rose-500/10 border-rose-500/25' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  active: 'bg-amber-500/10 border-amber-500/25' },
};

const ROLE_META = {
  EMPLOYEE: { label: 'Employee',  color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  MANAGER:  { label: 'Manager',   color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  ADMIN:    { label: 'Admin',     color: 'bg-rose-500/20   text-rose-300   border-rose-500/30' },
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);

  const links    = NAV_LINKS[user?.role] || [];
  const roleMeta = ROLE_META[user?.role]  || { label: user?.role, color: 'bg-slate-500/20 text-slate-300' };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        sidebar-premium
        fixed md:static inset-y-0 left-0 z-40
        w-64 flex flex-col
        transition-transform duration-300 ease-spring
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* ── Logo / Brand ── */}
        <div className="h-16 flex items-center px-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-indigo-violet flex items-center justify-center shadow-indigo">
              <Atom className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">AtomQuest</span>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Goal Portal</div>
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
          <div className="label-xs text-slate-600 px-3 mb-3">Navigation</div>

          {links.map((link, idx) => {
            const accent = ACCENT_COLORS[link.accent] || ACCENT_COLORS.indigo;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => { if (window.innerWidth < 768) onClose(); }}
                onMouseEnter={() => setHoveredLink(link.to)}
                onMouseLeave={() => setHoveredLink(null)}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 relative border
                  ${isActive
                    ? `${accent.active} text-white border-opacity-100`
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/4'
                  }
                `}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {({ isActive }) => (
                  <>
                    <span className={`
                      flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                      transition-all duration-200
                      ${isActive ? `${accent.bg} ${accent.icon}` : 'text-slate-500 group-hover:text-slate-300'}
                    `}>
                      <link.icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1 truncate">{link.label}</span>
                    {isActive && (
                      <ChevronRight className={`w-3.5 h-3.5 ${accent.icon} opacity-60`} />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ── User Card ── */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/4 transition-colors group">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full gradient-indigo-violet flex items-center justify-center text-white font-bold text-sm shadow-indigo">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080d1a]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-200 truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
            </div>

            <button
              onClick={logout}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role Badge */}
          <div className="mt-2 px-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border label-xs ${roleMeta.color}`}>
              {roleMeta.label}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
