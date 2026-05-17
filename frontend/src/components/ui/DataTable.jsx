import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonRow } from './Skeleton';
import { EmptyState, ErrorState } from './FeedbackStates';

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const DataTable = ({ columns, data, loading, error, onRetry, emptyMessage }) => {
  if (loading) {
    return (
      <div
        className="rounded-2xl overflow-hidden border border-white/[0.06]"
        style={{ background: 'rgba(12,18,32,0.8)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.05]"
          style={{ background: 'rgba(99,102,241,0.04)' }}>
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
    <div
      className="rounded-2xl overflow-hidden overflow-x-auto border border-white/[0.06]"
      style={{ background: 'rgba(12,18,32,0.8)', backdropFilter: 'blur(20px)' }}
    >
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr style={{ background: 'rgba(99,102,241,0.05)' }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-5 py-3.5 text-left border-b border-white/[0.05]"
                style={{ color: '#475569', fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((row, i) => (
              <motion.tr
                key={i}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="border-b border-white/[0.04] last:border-0 transition-colors duration-150 group"
                style={{ cursor: 'default' }}
                whileHover={{ backgroundColor: 'rgba(99,102,241,0.04)' }}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className="px-5 py-3.5 text-slate-300 text-sm">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
