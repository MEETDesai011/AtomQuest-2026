import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock } from 'lucide-react';
import { Modal } from './Modal';

export default function SessionExpiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleExpiry = () => setIsOpen(true);
    window.addEventListener('session-expired', handleExpiry);
    return () => window.removeEventListener('session-expired', handleExpiry);
  }, []);

  const handleLogin = () => {
    setIsOpen(false);
    navigate('/login');
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} hideCloseButton size="sm">
      <div className="text-center py-4">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-2">Session Expired</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Your secure session has expired due to inactivity. Please log in again to continue.
        </p>

        <button
          onClick={handleLogin}
          className="
            w-full py-3 rounded-xl text-sm font-semibold text-white
            gradient-indigo-violet
            shadow-[0_4px_15px_rgba(99,102,241,0.4)]
            hover:shadow-[0_6px_25px_rgba(99,102,241,0.5)]
            transition-all duration-200
            flex items-center justify-center gap-2
          "
        >
          <Lock className="w-4 h-4" />
          Log In Again
        </button>
      </div>
    </Modal>
  );
}
