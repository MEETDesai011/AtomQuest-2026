import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Menu, Command, Atom, Zap } from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  const ROLE_GRADIENT = {
    EMPLOYEE: 'from-indigo-500 to-violet-500',
    MANAGER:  'from-violet-500 to-purple-500',
    ADMIN:    'from-rose-500 to-orange-500',
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-16 flex items-center justify-between px-5 sticky top-0 z-20 shrink-0"
      style={{
        background: 'rgba(7,11,22,0.85)',
        backdropFilter: 'blur(32px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 1px 0 rgba(99,102,241,0.06)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Brand (desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}
          >
            <Atom className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">AtomQuest</span>
        </div>

        <div className="hidden md:block w-px h-4 bg-white/8 mx-1" />

        {/* Command Palette trigger */}
        <motion.button
          onClick={openCommandPalette}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 group"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
          aria-label="Open command palette"
        >
          <Command className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
          <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">Search or jump to...</span>
          <kbd className="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/6 text-slate-600">⌘K</kbd>
        </motion.button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* AI badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/8 border border-violet-500/15">
          <Zap className="w-3 h-3 text-violet-400" />
          <span className="text-[10px] font-bold text-violet-400/80 uppercase tracking-wider">AI On</span>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        </div>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl text-slate-500 hover:text-amber-300 hover:bg-amber-400/8 transition-all duration-200"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDarkMode ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <NotificationCenter />

        <div className="w-px h-5 bg-white/8 mx-1" />

        {/* User info */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          whileHover={{ x: -1 }}
          transition={{ duration: 0.15 }}
        >
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-200 leading-tight">{user?.name}</div>
            <div className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">{user?.role}</div>
          </div>
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer ring-2 ring-transparent group-hover:ring-indigo-500/40 transition-all duration-200"
              style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070b16]" />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};
