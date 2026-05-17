export const PageWrapper = ({ title, subtitle, actions, children }) => (
  <div className="flex-1 p-5 lg:p-8 overflow-y-auto w-full min-h-0">
    <div className="max-w-7xl mx-auto space-y-6">
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1">
          {(title || subtitle) && (
            <div className="animate-fade-up">
              {title && (
                <h1 className="heading-xl text-slate-100">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
          )}
          {actions && (
            <div className="flex items-center gap-3 shrink-0 animate-fade-up delay-100">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  </div>
);
