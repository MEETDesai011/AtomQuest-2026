import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, hideCloseButton, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm:  'max-w-sm',
    md:  'max-w-lg',
    lg:  'max-w-2xl',
    xl:  'max-w-4xl',
    full:'max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,13,26,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={hideCloseButton ? undefined : onClose}
    >
      <div
        className={`
          relative w-full ${sizeClasses[size] || sizeClasses.md} mx-auto
          rounded-2xl overflow-hidden animate-scale-in
          shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(99,102,241,0.15)]
        `}
        style={{
          background: 'rgba(10,15,28,0.97)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {title && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/6">
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
