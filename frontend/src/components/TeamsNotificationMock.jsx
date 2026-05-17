import React, { useState, useEffect } from 'react';
import { MessageSquare, X, CheckCircle } from 'lucide-react';

export default function TeamsNotificationMock({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 400);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed bottom-24 right-4 z-[60] w-80
        overflow-hidden rounded-2xl
        transition-all duration-400
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{
        background: 'rgba(10,15,28,0.97)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(99,102,241,0.2)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08)',
      }}
    >
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="bg-indigo-500/15 text-indigo-400 rounded-xl p-2 shrink-0">
          <MessageSquare className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AtomQuest Notification</span>
            <span className="text-[10px] text-slate-600">Just now</span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200">Goal Portal</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
        </div>

        {/* Close */}
        <button
          onClick={() => { setIsVisible(false); setTimeout(onClose, 400); }}
          className="text-slate-600 hover:text-slate-300 p-1 rounded-lg hover:bg-white/8 transition-all shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
          style={{
            width: '100%',
            animation: 'progressFill 5s linear forwards',
            animationDirection: 'reverse',
          }}
        />
      </div>
    </div>
  );
}
