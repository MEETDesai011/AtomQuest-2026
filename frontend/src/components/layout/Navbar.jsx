import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NotificationCenter } from './NotificationCenter';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Menu, Command, Atom } from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  return (
    <header className="
      h-16 flex items-center justify-between px-5
      border-b border-white/5
      bg-[rgba(8,13,26,0.8)] backdrop-blur-2xl
      sticky top-0 z-20
      transition-all duration-300
    ">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand (desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg gradient-indigo-violet flex items-center justify-center shadow-indigo">
            <Atom className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">AtomQuest</span>
        </div>

        {/* Breadcrumb divider */}
        <div className="hidden md:block w-px h-4 bg-white/10 mx-1" />

        {/* Command Palette trigger */}
        <button
          onClick={openCommandPalette}
          className="
            hidden md:flex items-center gap-2 px-3 py-1.5
            rounded-lg border border-white/8 bg-white/3
            text-sm text-slate-500 hover:text-slate-300
            hover:bg-white/6 hover:border-white/12
            transition-all duration-200
            group
          "
          aria-label="Open command palette"
        >
          <Command className="w-3.5 h-3.5 group-hover:text-indigo-400 transition-colors" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-slate-500">⌘K</kbd>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-400/8 transition-all duration-200"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode
            ? <Sun className="w-4.5 h-4.5" />
            : <Moon className="w-4.5 h-4.5" />
          }
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* Divider */}
        <div className="w-px h-5 bg-white/8 mx-1" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-200 leading-tight">{user?.name}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role}</div>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-full gradient-indigo-violet flex items-center justify-center text-white font-bold text-sm shadow-indigo cursor-pointer">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080d1a]" />
          </div>
        </div>
      </div>
    </header>
  );
};
