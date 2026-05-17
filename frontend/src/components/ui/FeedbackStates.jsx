import { InboxIcon, AlertCircle, RefreshCw } from 'lucide-react';

export const EmptyState = ({ message = 'No data found', action }) => (
  <div className="card flex flex-col items-center justify-center p-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-6">
      <InboxIcon className="w-7 h-7 text-indigo-400" />
    </div>
    <h3 className="text-base font-semibold text-slate-300 mb-2">{message}</h3>
    <p className="text-sm text-slate-500 max-w-xs">
      Nothing here yet. Check back later or take an action.
    </p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-6 btn-primary"
      >
        {action.label}
      </button>
    )}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="card flex flex-col items-center justify-center p-16 text-center border-rose-500/20">
    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
      <AlertCircle className="w-7 h-7 text-rose-400" />
    </div>
    <h3 className="text-base font-semibold text-slate-300 mb-2">Something went wrong</h3>
    <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    )}
  </div>
);
