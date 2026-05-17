import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, User, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RoleSwitcher() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const switchRole = async (email, role) => {
    try {
      setLoading(role);
      await login(email, 'password123');
    } catch (err) {
      console.error('Failed to switch role', err);
    } finally {
      setLoading(null);
    }
  };

  const ROLES = [
    { email: 'john.doe@atomquest.com',     role: 'EMPLOYEE', icon: User,   label: 'Employee', color: 'bg-indigo-500 hover:bg-indigo-600 shadow-[0_4px_15px_rgba(99,102,241,0.4)]' },
    { email: 'sarah.manager@atomquest.com',role: 'MANAGER',  icon: Users,  label: 'Manager',  color: 'bg-violet-500 hover:bg-violet-600 shadow-[0_4px_15px_rgba(139,92,246,0.4)]' },
    { email: 'admin@atomquest.com',         role: 'ADMIN',   icon: Shield, label: 'Admin',    color: 'bg-rose-500 hover:bg-rose-600 shadow-[0_4px_15px_rgba(244,63,94,0.4)]' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          w-8 h-8 rounded-full
          bg-[rgba(10,15,28,0.9)] border border-white/10
          text-slate-500 hover:text-slate-200
          flex items-center justify-center
          transition-all duration-200 backdrop-blur-xl
        "
        title={collapsed ? 'Show demo switcher' : 'Hide demo switcher'}
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {!collapsed && (
        <>
          {/* Label */}
          <div
            className="
              px-3 py-2 rounded-xl text-xs font-semibold text-slate-500
              bg-[rgba(10,15,28,0.9)] border border-white/8
              backdrop-blur-xl tracking-wider uppercase
            "
          >
            Demo
          </div>

          {/* Role buttons */}
          {ROLES.map(({ email, role, icon: Icon, label, color }) => (
            <button
              key={role}
              onClick={() => switchRole(email, role)}
              disabled={loading !== null}
              className={`
                ${color}
                w-10 h-10 rounded-full text-white
                flex items-center justify-center
                transition-all duration-200 disabled:opacity-40
                hover:scale-110 active:scale-95
                relative group
              `}
              title={`Switch to ${label}`}
            >
              {loading === role
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Icon className="w-4 h-4" />
              }
              {/* Tooltip */}
              <span className="
                absolute -top-9 left-1/2 -translate-x-1/2
                bg-[rgba(10,15,28,0.95)] text-white text-xs px-2.5 py-1.5 rounded-lg
                border border-white/10 whitespace-nowrap
                opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                transition-all duration-200 pointer-events-none
              ">
                {label}
              </span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
