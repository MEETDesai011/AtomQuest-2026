import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, MessageSquare, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  APPROVAL:   { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Approved'   },
  ESCALATION: { icon: AlertTriangle, color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    label: 'Escalation' },
  COMMENT:    { icon: MessageSquare, color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    label: 'Comment'    },
};

export const NotificationCenter = () => {
  const [isOpen, setIsOpen]               = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const { user }  = useAuth();
  const panelRef  = useRef(null);

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('token') },
      reconnection: true, reconnectionAttempts: 5,
      reconnectionDelay: 1000, reconnectionDelayMax: 5000,
      timeout: 20000, autoConnect: true,
    });

    socket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);
      const cfg = TYPE_CONFIG[data.type] || TYPE_CONFIG.COMMENT;
      const Icon = cfg.icon;
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: t.visible ? 1 : 0, x: t.visible ? 0 : 40 }}
          className="flex items-start gap-3 p-4 rounded-xl border max-w-sm w-full"
          style={{ background: 'rgba(9,14,28,0.97)', backdropFilter: 'blur(20px)', borderColor: 'rgba(99,102,241,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          <div className={`${cfg.bg} p-2 rounded-lg shrink-0`}>
            <Icon className={`w-4 h-4 ${cfg.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200">{data.title}</p>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{data.message}</p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="text-slate-600 hover:text-slate-300 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ), { duration: 5000 });
    });

    return () => { socket.disconnect(); };
  }, [user]);

  const markAllRead = () => setUnreadCount(0);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(!isOpen); markAllRead(); }}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          isOpen
            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
            : 'text-slate-500 hover:text-slate-200 hover:bg-white/6'
        }`}
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-[#070b16]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              ref={panelRef}
              key="notif-panel"
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute right-0 mt-2 w-80 rounded-2xl z-40 overflow-hidden flex flex-col"
              style={{
                maxHeight: '440px',
                background: 'rgba(9,14,28,0.98)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(99,102,241,0.18)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08)',
              }}
            >
              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Notifications</h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/8 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center mb-3">
                      <Inbox className="w-5 h-5 text-slate-700" />
                    </div>
                    <p className="text-sm text-slate-600">You're all caught up</p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((n, i) => {
                      const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.COMMENT;
                      const Icon = cfg.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/3 transition-colors cursor-pointer"
                        >
                          <div className={`${cfg.bg} border ${cfg.border} p-1.5 rounded-lg shrink-0 mt-0.5`}>
                            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-300">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <time className="text-[10px] text-slate-700">
                                {new Date(n.timestamp || Date.now()).toLocaleTimeString()}
                              </time>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} uppercase tracking-wider`}>
                                {cfg.label}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
