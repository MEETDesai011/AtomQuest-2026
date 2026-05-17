import { SkeletonRow } from './Skeleton';
import { EmptyState, ErrorState } from './FeedbackStates';

export const DataTable = ({ columns, data, loading, error, onRetry, emptyMessage }) => {
  if (loading) {
    return (
      <div className="card overflow-hidden">
        {/* Ghost header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5 bg-white/2">
          {columns.map((_, i) => (
            <div key={i} className="flex-1 h-3 bg-white/5 rounded shimmer" />
          ))}
        </div>
        {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!data?.length) return <EmptyState message={emptyMessage || 'No records found'} />;

  return (
    <div className="card overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="
                  px-5 py-3.5 text-left
                  text-[11px] font-semibold text-slate-500 uppercase tracking-widest
                  border-b border-white/5 bg-white/2
                  first:rounded-tl-xl last:rounded-tr-xl
                "
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`
                border-b border-white/4 last:border-0
                hover:bg-indigo-500/4 transition-colors duration-150
                animate-fade-up
              `}
              style={{ animationDelay: `${i * 30}ms`, opacity: 0 }}
            >
              {columns.map((col, idx) => (
                <td key={idx} className="px-5 py-3.5 text-slate-300">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
