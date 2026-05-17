import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/FeedbackStates';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, defs
} from 'recharts';
import { Sparkles, TrendingUp, BarChart3, ChevronDown } from 'lucide-react';

const CHART_COLORS = {
  Q1: '#818cf8', Q2: '#22d3ee', Q3: '#a78bfa', Q4: '#fb7185',
  MIN: '#818cf8', MAX: '#22d3ee', TIMELINE: '#a78bfa', ZERO: '#fb7185',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(9,14,28,0.97)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ color: '#e8eeff', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 11, margin: '2px 0' }}>
          {p.name}: <strong>{p.value ?? '—'}</strong>
        </p>
      ))}
    </div>
  );
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

const ChartCard = ({ title, children, loading, error, empty }) => (
  <div
    className="rounded-2xl overflow-hidden border border-white/[0.06] p-6"
    style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
  >
    {title && <h3 className="text-sm font-bold text-slate-200 mb-5">{title}</h3>}
    {loading ? <SkeletonCard /> : error ? <ErrorState message={error} /> : empty ? (
      <div className="text-center py-10 text-sm text-slate-600">{empty}</div>
    ) : children}
  </div>
);

export default function Analytics() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data: qoqData,     loading: loadingQoq,     error: errorQoq     } = useApi(`/analytics/qoq?year=${year}`);
  const { data: heatmapData, loading: loadingHeatmap, error: errorHeatmap } = useApi(`/analytics/heatmap?year=${year}`);
  const { data: distData,    loading: loadingDist                          } = useApi(`/analytics/distribution?year=${year}`);

  const isQoqEmpty = !qoqData || qoqData.every(e => e.Q1 === null && e.Q2 === null && e.Q3 === null && e.Q4 === null);

  return (
    <PageWrapper title="System Analytics" subtitle="Quarter-over-quarter trends, goal distribution, and manager effectiveness insights.">

      {/* Year selector */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="flex items-center gap-3">
        <label htmlFor="analytics-year" className="text-sm font-semibold text-slate-500">Fiscal Year</label>
        <div className="relative">
          <select
            id="analytics-year"
            className="appearance-none pl-4 pr-8 py-2 rounded-xl text-sm text-slate-200 font-semibold border border-white/[0.08] outline-none transition-all cursor-pointer"
            style={{ background: 'rgba(12,18,32,0.9)', backdropFilter: 'blur(12px)' }}
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible"
        className="rounded-2xl overflow-hidden relative border border-violet-500/18 p-6"
        style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/6 to-indigo-500/3 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">AtomQuest AI Insights</h3>
            <span className="ml-1 relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
          </div>
          <ul className="space-y-3">
            {[
              { tag: 'Anomaly',    color: 'text-rose-400',   bg: 'bg-rose-500/8 border-rose-500/15',     text: 'Logistics completion dropped 12% in Q3, deviating from their historical 88% average.' },
              { tag: 'Prediction', color: 'text-amber-400',  bg: 'bg-amber-500/8 border-amber-500/15',   text: '3 employees in Sales have "DRAFT" goals mathematically unlikely to be met by Q4.' },
              { tag: 'Suggestion', color: 'text-indigo-400', bg: 'bg-indigo-500/8 border-indigo-500/15', text: 'Consider unlocking "Cloud Migration" goals for Product as 40% are marked REWORK.' },
            ].map((item, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${item.bg}`}
              >
                <span className={`font-bold shrink-0 ${item.color}`}>{item.tag}:</span>
                <span className="text-slate-400 leading-relaxed">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* QoQ Trend Chart */}
      <motion.section custom={2} variants={sectionVariants} initial="hidden" animate="visible">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Quarter-over-Quarter Progress Trends</h3>
        </div>
        <ChartCard loading={loadingQoq} error={errorQoq} empty={isQoqEmpty ? `No quarterly data for ${year}.` : null}>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={qoqData || []}>
              <defs>
                {['Q1','Q2','Q3','Q4'].map(q => (
                  <linearGradient key={q} id={`grad${q}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS[q]} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CHART_COLORS[q]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="4" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="employeeName" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              {['Q1','Q2','Q3','Q4'].map(q => (
                <Area key={q} type="monotone" dataKey={q} stroke={CHART_COLORS[q]} strokeWidth={2}
                  fillOpacity={1} fill={`url(#grad${q})`} animationDuration={1500} connectNulls dot={{ r: 3, fill: CHART_COLORS[q] }} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.section>

      {/* Goal Distribution */}
      <motion.section custom={3} variants={sectionVariants} initial="hidden" animate="visible">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Goal Distribution by Thrust Area ({year})</h3>
        </div>
        <ChartCard loading={loadingDist} empty={!distData?.length ? `No distribution data for ${year}.` : null}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={distData || []}>
              <CartesianGrid strokeDasharray="4" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="thrustArea" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              {['MIN','MAX','TIMELINE','ZERO'].map(k => (
                <Bar key={k} dataKey={k} fill={CHART_COLORS[k]} radius={[4, 4, 0, 0]} animationDuration={1000} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.section>

      {/* Manager Effectiveness */}
      <motion.section custom={4} variants={sectionVariants} initial="hidden" animate="visible">
        <h3 className="text-base font-bold text-slate-200 mb-4">Manager Effectiveness Index</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: 'Avg Turnaround Time', value: '1.2', unit: 'Days', sub: '↓ 14% from last quarter', color: 'text-indigo-400', bg: 'border-indigo-500/15', accent: 'bg-indigo-500/8' },
            { title: 'Inline Edits Ratio',  value: '18',  unit: '%',    sub: 'Target tweaks before approval', color: 'text-violet-400', bg: 'border-violet-500/15', accent: 'bg-violet-500/8' },
            { title: 'Rework Requests',     value: '4',   unit: '%',    sub: 'Of total submissions',    color: 'text-rose-400',   bg: 'border-rose-500/15',   accent: 'bg-rose-500/8' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`rounded-2xl p-6 text-center border ${stat.bg} ${stat.accent} relative overflow-hidden`}
              style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
            >
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{stat.title}</div>
              <div className={`text-4xl font-black ${stat.color}`}>
                {stat.value}<span className="text-lg font-semibold opacity-70">{stat.unit}</span>
              </div>
              <div className="text-xs text-slate-600 mt-3">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </PageWrapper>
  );
}
