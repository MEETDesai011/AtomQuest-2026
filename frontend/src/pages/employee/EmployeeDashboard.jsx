import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProductTour } from '../../components/layout/ProductTour';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Target, CheckCircle, Clock, BarChart3,
  PlusCircle, SendHorizonal, Sparkles,
  AlertCircle, TrendingUp, Zap, Edit3, Trash2, ArrowRight
} from 'lucide-react';

const GREETING_ICONS = { morning: '🌅', afternoon: '☀️', evening: '🌙' };

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { data: cycles, loading: loadingCycles } = useApi('/cycles');
  const activeCycle = cycles?.find(c => c.isActive && c.phase === 'GOAL_SETTING');

  const { data: goals, loading: loadingGoals, refetch } = useApi(
    activeCycle ? `/goals/mine?cycleId=${activeCycle.id}` : null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAll = async () => {
    if (!activeCycle) return;
    setIsSubmitting(true);
    try {
      await api.post('/goals/submit', { cycleId: activeCycle.id });
      toast.success('Goals submitted successfully!');
      window.dispatchEvent(new CustomEvent('teams-notify', {
        detail: 'You have submitted your goals for approval. Your manager has been notified.'
      }));
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit goals');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGoal = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await api.delete(`/goals/${id}`);
      toast.success('Goal deleted');
      refetch();
    } catch {
      toast.error('Failed to delete goal');
    }
  };

  if (loadingCycles) {
    return (
      <PageWrapper title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </PageWrapper>
    );
  }

  const totalWeight   = goals?.reduce((sum, g) => sum + g.weightage, 0) || 0;
  const approvedCount = goals?.filter(g => g.status === 'APPROVED').length || 0;
  const draftCount    = goals?.filter(g => g.status === 'DRAFT' || g.status === 'REWORK').length || 0;
  const weightOk      = totalWeight === 100;

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const greeting  = `Good ${timeOfDay}`;
  const firstName = user?.name?.split(' ')[0] || 'Employee';

  const columns = [
    {
      label: 'Thrust Area',
      key: 'thrustArea',
      render: r => (
        <span className="font-bold text-indigo-400 text-[11px] uppercase tracking-widest px-2 py-1 rounded-lg bg-indigo-500/8 border border-indigo-500/15">
          {r.thrustArea}
        </span>
      )
    },
    {
      label: 'Goal Title',
      key: 'title',
      render: r => (
        <div className="max-w-xs">
          <div className="text-sm font-semibold text-slate-200 truncate" title={r.title}>{r.title}</div>
          <div className="text-xs text-slate-600 mt-0.5">{r.target} {r.uom}</div>
        </div>
      )
    },
    {
      label: 'Weightage',
      key: 'weightage',
      render: r => (
        <div className="flex items-center gap-3 min-w-[100px]">
          <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(r.weightage, 100)}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="text-xs font-bold text-slate-300 w-8 text-right">{r.weightage}%</span>
        </div>
      )
    },
    {
      label: 'Status',
      key: 'status',
      render: r => <StatusBadge status={r.status} />
    },
    {
      label: 'Actions',
      key: 'actions',
      render: r => (r.status === 'DRAFT' || r.status === 'REWORK') && !r.isLocked ? (
        <div className="flex items-center gap-1.5">
          <Link
            to={`/employee/goals?edit=${r.id}`}
            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/12 hover:scale-110 transition-all duration-200"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => deleteGoal(r.id)}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/12 hover:scale-110 transition-all duration-200"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null
    },
  ];

  return (
    <>
      <ProductTour />
      <PageWrapper
        title={
          <span className="flex items-center gap-3">
            <span>{greeting}, {firstName}</span>
            <span className="text-3xl">{GREETING_ICONS[timeOfDay]}</span>
          </span>
        }
        subtitle="Your AI-powered goal workspace. Track progress, manage submissions, and stay ahead."
        actions={
          activeCycle && (
            <div className="flex items-center gap-3">
              <Link to="/employee/goals" className="btn-secondary flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Goal
              </Link>
              <motion.button
                onClick={submitAll}
                disabled={isSubmitting || draftCount === 0 || !weightOk}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <SendHorizonal className="w-4 h-4" />
                )}
                Submit All Goals
              </motion.button>
            </div>
          )
        }
      >
        {/* ── Cycle Banner ── */}
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
          {activeCycle ? (
            <div
              className="rounded-2xl overflow-hidden relative border border-indigo-500/15"
              style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/6 to-violet-500/4 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                    <Target className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      Goal Setting Cycle {activeCycle.year}
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Window closes {new Date(activeCycle.windowClose).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${weightOk ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {totalWeight}%
                    </div>
                    <div className="text-xs text-slate-600">of 100% filled</div>
                  </div>
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                      <motion.circle
                        cx="32" cy="32" r="26" fill="none"
                        stroke={weightOk ? '#10b981' : '#f59e0b'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 163.4' }}
                        animate={{ strokeDasharray: `${(totalWeight / 100) * 163.4} 163.4` }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {weightOk
                        ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                        : <AlertCircle className="w-5 h-5 text-amber-400" />
                      }
                    </div>
                  </div>
                </div>
              </div>

              {!weightOk && (
                <div className="px-5 pb-4">
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/6 border border-amber-500/15"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-400">
                      Weightage is <strong>{totalWeight}%</strong> — must equal exactly 100% before submission.
                      {totalWeight < 100 ? ` Add ${100 - totalWeight}% more.` : ` Remove ${totalWeight - 100}%.`}
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="rounded-2xl border border-amber-500/15 p-5"
              style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-300">No Active Cycle</div>
                  <div className="text-xs text-slate-500 mt-0.5">Goal setting window is currently closed.</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Goals"  value={goals?.length || 0}   icon={Target}      accent="indigo"  sub={activeCycle ? `Cycle ${activeCycle.year}` : 'No active cycle'} delay={0.1} />
          <StatCard label="Approved"     value={approvedCount}          icon={CheckCircle} accent="emerald" trend={approvedCount > 0 ? 12 : 0} sub="Manager approved" delay={0.18} />
          <StatCard label="Pending"      value={draftCount}             icon={Clock}       accent={draftCount > 0 ? 'amber' : 'indigo'} sub="Draft or rework" delay={0.26} />
          <StatCard label="Weightage"    value={`${totalWeight}%`}      icon={BarChart3}   accent={weightOk ? 'emerald' : 'amber'} sub={weightOk ? 'Ready to submit ✓' : 'Must equal 100%'} progress={totalWeight} delay={0.34} />
        </div>

        {/* ── AI Insight Banner ── */}
        {import.meta.env.VITE_ENABLE_AI_INSIGHTS !== 'false' && (
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl overflow-hidden relative border border-violet-500/18"
            style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/3 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <div className="relative flex items-start gap-4 p-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-200">AI Insight</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-500/15 text-violet-400 rounded-full uppercase tracking-wider border border-violet-500/20">Personalized</span>
                  <span className="flex h-2 w-2 ml-auto">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-violet-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  You are currently <strong className="text-rose-400">15% behind target</strong> on your "Q3 Revenue Expansion" goal.
                  Historically, logging weekly check-ins improves end-of-quarter achievement by{' '}
                  <strong className="text-emerald-400">22%</strong>.
                </p>
                <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                  View full AI analysis <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Goals Table ── */}
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-200">My Goals</h3>
              {goals?.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                  {goals.length}
                </span>
              )}
            </div>
          </div>
          <DataTable
            columns={columns}
            data={goals}
            loading={loadingGoals}
            emptyMessage="No goals for this cycle yet. Click 'Add Goal' to get started."
          />
        </motion.div>
      </PageWrapper>
    </>
  );
}
