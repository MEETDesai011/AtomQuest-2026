import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, MessageSquare, RefreshCw, Inbox } from 'lucide-react';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  APPROVAL:   { icon: CheckCircle,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Approved' },
  ESCALATION: { icon: AlertTriangle, color: 'text-rose-400',    bg: 'bg-rose-500/10',    label: 'Escalation' },
  COMMENT:    { icon: MessageSquare, color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Comment' },
};

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('token') },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Connected to real-time notification layer');
    });

    socket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);

      // Premium toast
      toast.custom((t) => {
        const cfg = TYPE_CONFIG[data.type] || TYPE_CONFIG.COMMENT;
        const Icon = cfg.icon;
        return (
          <div className={`
            ${t.visible ? 'animate-slide-right' : 'animate-fade-in'}
            flex items-start gap-3 p-4 rounded-xl border
            max-w-sm w-full
            shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          `}
          style={{
            background: 'rgba(10,15,28,0.97)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(99,102,241,0.2)',
          }}>
            <div className={`${cfg.bg} p-2 rounded-lg shrink-0`}>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200">{data.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{data.message}</p>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="text-slate-600 hover:text-slate-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      }, { duration: 5000 });
    });

    return () => { socket.disconnect(); };
  }, [user]);

  const markAllRead = () => setUnreadCount(0);

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); markAllRead(); }}
        className={`
          relative p-2 rounded-xl transition-all duration-200
          ${isOpen
            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/6'
          }
        `}
        aria-label="View notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="
            absolute -top-0.5 -right-0.5
            flex h-4 w-4 items-center justify-center
            rounded-full bg-rose-500 text-[9px] font-bold text-white
            ring-2 ring-[#080d1a]
          ">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div
            ref={panelRef}
            className="
              notif-panel
              absolute right-0 mt-2 w-80 rounded-2xl z-40
              overflow-hidden flex flex-col
              animate-scale-in
            "
            style={{ maxHeight: '420px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Notifications</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center mb-3">
                    <Inbox className="w-5 h-5 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500">You're all caught up</p>
                </div>
              ) : (
                <div>
                  {notifications.map((n, i) => {
                    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.COMMENT;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={i}
                        className="
                          flex items-start gap-3 px-4 py-3
                          border-b border-white/4 last:border-0
                          hover:bg-white/3 transition-colors cursor-pointer
                          animate-fade-up
                        "
                        style={{ animationDelay: `${i * 40}ms`, opacity: 0 }}
                      >
                        <div className={`${cfg.bg} p-1.5 rounded-lg shrink-0 mt-0.5`}>
                          <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-300">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <time className="text-[10px] text-slate-600 mt-1 block">
                            {new Date(n.timestamp || Date.now()).toLocaleTimeString()}
                          </time>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
