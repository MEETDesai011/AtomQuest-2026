import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const FormField = forwardRef(({ label, error, className = '', hint, ...props }, ref) => {
  const id = props.id || props.name;
  const baseInput = `
    input-base w-full text-slate-200 placeholder-slate-600
    ${error
      ? 'border-rose-500/40 bg-rose-500/5 focus:border-rose-500/60 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]'
      : ''
    }
  `;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      {props.type === 'textarea' ? (
        <textarea
          ref={ref}
          id={id}
          {...props}
          className={`${baseInput} min-h-[100px] resize-y`}
        />
      ) : props.type === 'select' ? (
        <select
          ref={ref}
          id={id}
          {...props}
          className={`${baseInput} cursor-pointer`}
        >
          {props.children}
        </select>
      ) : (
        <input
          ref={ref}
          id={id}
          {...props}
          className={baseInput}
        />
      )}

      {hint && !error && (
        <p className="text-xs text-slate-600">{hint}</p>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400" aria-describedby={id}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error.message}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
