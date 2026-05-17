import { motion } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
  },
};

export const PageWrapper = ({ title, subtitle, actions, children }) => (
  <div className="flex-1 p-5 lg:p-8 overflow-y-auto w-full min-h-0">
    <motion.div
      className="max-w-7xl mx-auto space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {title && (
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-100 leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
              )}
            </motion.div>
          )}
          {actions && (
            <motion.div
              className="flex items-center gap-3 shrink-0"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {actions}
            </motion.div>
          )}
        </div>
      )}
      {children}
    </motion.div>
  </div>
);
