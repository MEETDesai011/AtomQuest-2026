import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Target, Trophy, Users, TrendingUp,
  ShieldCheck, RefreshCcw, BarChart3, ScrollText, FileBarChart,
  AlertTriangle, GitBranch, Activity, ChevronRight, Atom, LogOut, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = {
  EMPLOYEE: [
    { to: '/employee/dashboard', label: 'Dashboard',    icon: LayoutDashboard, accent: 'indigo' },
    { to: '/employee/goals',     label: 'My Goals',     icon: Target,           accent: 'cyan' },
    { to: '/employee/achievement', label: 'Achievements', icon: Trophy,         accent: 'emerald' },
  ],
  MANAGER: [
    { to: '/manager/dashboard',    label: 'Team Dashboard', icon: LayoutDashboard, accent: 'indigo' },
    { to: '/manager/effectiveness', label: 'Effectiveness', icon: TrendingUp,      accent: 'violet' },
  ],
  ADMIN: [
    { to: '/admin/dashboard',          label: 'Control Center',   icon: LayoutDashboard, accent: 'indigo' },
    { to: '/admin/cycles',             label: 'Cycle Manager',    icon: RefreshCcw,      accent: 'cyan' },
    { to: '/admin/reports',            label: 'Reports',          icon: FileBarChart,    accent: 'emerald' },
    { to: '/admin/audit',              label: 'Audit Log',        icon: ScrollText,      accent: 'violet' },
    { to: '/admin/analytics',          label: 'Analytics',        icon: BarChart3,       accent: 'indigo' },
    { to: '/admin/escalations',        label: 'Escalation Log',   icon: AlertTriangle,   accent: 'rose' },
    { to: '/admin/escalation-dashboard', label: 'Escalation Ops', icon: Activity,       accent: 'rose' },
    { to: '/admin/departments',        label: 'Dept. Comparison', icon: Users,           accent: 'amber' },
    { to: '/admin/dependencies',       label: 'Goal Graph',       icon: GitBranch,       accent: 'cyan' },
  ],
};

const ACCENT = {
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/12',  border: 'border-indigo-500/30',  glow: 'rgba(99,102,241,0.2)' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    glow: 'rgba(34,211,238,0.15)' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', glow: 'rgba(52,211,153,0.15)' },
  violet:  { icon: 'text-violet-400',  bg: 'bg-violet-500/12',  border: 'border-violet-500/30',  glow: 'rgba(139,92,246,0.2)' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/25',    glow: 'rgba(251,113,133,0.15)' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   glow: 'rgba(251,191,36,0.15)' },
};

const ROLE_META = {
  EMPLOYEE: { label: 'Employee',  color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  MANAGER:  { label: 'Manager',   color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  ADMIN:    { label: 'Admin',     color: 'bg-rose-500/15   text-rose-300   border-rose-500/30' },
};

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 35 } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] } }),
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const links    = NAV_LINKS[user?.role] || [];
  const roleMeta = ROLE_META[user?.role] || { label: user?.role, color: 'bg-slate-500/15 text-slate-300' };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 flex flex-col h-full
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          background: 'rgba(7,11,22,0.97)',
          backdropFilter: 'blur(40px)',
          borderRight: '1px solid rgba(99,102,241,0.08)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Subtle top gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.04] shrink-0">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}
            >
              <Atom className="w-4.5 h-4.5 text-white" />
            </motion.div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">AtomQuest</div>
              <div className="text-[10px] text-slate-600 font-semibold tracking-widest uppercase">Goal Portal</div>
            </div>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 overflow-y-auto space-y-0.5">
          <div className="text-[10px] font-bold text-slate-700 px-3 mb-3 tracking-widest uppercase">Navigation</div>

          {links.map((link, idx) => {
            const ac = ACCENT[link.accent] || ACCENT.indigo;
            return (
              <motion.div
                key={link.to}
                custom={idx}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to={link.to}
                  onClick={() => { if (window.innerWidth < 768) onClose(); }}
                  className={({ isActive }) => `
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 relative border
                    ${isActive
                      ? `${ac.bg} ${ac.border} text-white`
                      : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-pill"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: `linear-gradient(135deg, ${ac.glow} 0%, transparent 100%)` }}
                          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                        />
                      )}
                      <span className={`
                        relative z-10 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                        transition-all duration-200
                        ${isActive ? `${ac.bg} ${ac.icon}` : 'text-slate-600 group-hover:text-slate-400'}
                      `}>
                        <link.icon className="w-4 h-4" />
                      </span>
                      <span className="relative z-10 flex-1 truncate">{link.label}</span>
                      {isActive && (
                        <ChevronRight className={`relative z-10 w-3.5 h-3.5 ${ac.icon} opacity-60`} />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* AI Copilot hint */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/5 border border-violet-500/12 text-[11px] text-violet-400/70">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>AI Copilot active</span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          </div>
        </div>

        {/* User card */}
        <div className="p-3 border-t border-white/[0.04] shrink-0">
          <motion.div
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-pointer"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <div className="relative shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070b16]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-300 truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-600 truncate">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </motion.div>
          <div className="mt-2 px-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wider uppercase ${roleMeta.color}`}>
              {roleMeta.label}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
