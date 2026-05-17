import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/FeedbackStates';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const COLORS = ['#85adff', '#53ddfc', '#9093ff', '#ffb4ab', '#10b981', '#f59e0b'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Analytics() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data: qoqData, loading: loadingQoq, error: errorQoq } = useApi(`/analytics/qoq?year=${year}`);
  const { data: heatmapData, loading: loadingHeatmap, error: errorHeatmap } = useApi(`/analytics/heatmap?year=${year}`);

  const { data: distData, loading: loadingDist } = useApi(`/analytics/distribution?year=${year}`);

  return (
    <PageWrapper title="System Analytics">
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        
        {/* Year selector */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <label htmlFor="analytics-year" className="text-sm font-medium text-gray-500 dark:text-[#c7c4d7]">Fiscal Year</label>
          <select
            id="analytics-year"
            className="px-4 py-2 bg-gray-50 dark:bg-[#171f33] border border-gray-200 dark:border-[#464554] rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#c0c1ff] outline-none transition-all"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </motion.div>

        {/* AI Contextual Insights */}
        <motion.div variants={itemVariants} className="mb-10 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-[#c0c1ff]/20 rounded-2xl p-6 shadow-sm backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 dark:bg-[#c0c1ff]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-indigo-600 dark:bg-[#c0c1ff]/20 p-3 rounded-full shrink-0">
              <svg className="w-6 h-6 text-indigo-600 dark:text-[#c0c1ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                AtomQuest AI Insights
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              </h3>
              <ul className="space-y-3 text-sm opacity-90">
                <motion.li initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.3}} className="flex gap-2"><span className="font-semibold text-indigo-600 dark:text-[#c0c1ff]">Anomaly:</span> Logistics completion dropped 12% in Q3, deviating from their historical 88% average.</motion.li>
                <motion.li initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.4}} className="flex gap-2"><span className="font-semibold text-purple-400">Prediction:</span> 3 employees in Sales have "DRAFT" goals mathematically unlikely to be met by Q4.</motion.li>
                <motion.li initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.5}} className="flex gap-2"><span className="font-semibold text-indigo-600 dark:text-[#c0c1ff]">Suggestion:</span> Consider unlocking "Cloud Migration" goals for Product as 40% are marked REWORK.</motion.li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* QoQ Trend Chart */}
        <motion.section variants={itemVariants} className="mb-10">
          <h3 className="text-lg font-bold mb-4">Quarter-over-Quarter Progress Trends</h3>
          {loadingQoq ? (
            <SkeletonCard />
          ) : errorQoq ? (
            <ErrorState message={errorQoq} />
          ) : !qoqData || qoqData.every(emp => emp.Q1 === null && emp.Q2 === null && emp.Q3 === null && emp.Q4 === null) ? (
             <div className="bg-white dark:bg-[#0b1326] rounded-2xl border border-gray-200 dark:border-[#464554] shadow-sm p-6 text-center glass-panel">
               <p className="text-gray-500 dark:text-[#c7c4d7] py-10 font-medium">No quarterly progress data available for {year}.</p>
             </div>
          ) : (
            <div className="bg-white dark:bg-[#0b1326] rounded-2xl border border-gray-200 dark:border-[#464554] shadow-sm p-6 glass-panel">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={qoqData || []}>
                  <defs>
                    <linearGradient id="colorQ1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQ2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQ3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQ4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} />
                  <XAxis dataKey="employeeName" tick={{ fontSize: 12, fill: '#c7c4d7' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#c7c4d7' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#171f33', borderColor: '#464554', borderRadius: '8px', color: '#dae2fd' }} />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="Q1" stroke={COLORS[0]} fillOpacity={1} fill="url(#colorQ1)" strokeWidth={2} animationDuration={1500} connectNulls />
                  <Area type="monotone" dataKey="Q2" stroke={COLORS[1]} fillOpacity={1} fill="url(#colorQ2)" strokeWidth={2} animationDuration={1500} connectNulls />
                  <Area type="monotone" dataKey="Q3" stroke={COLORS[2]} fillOpacity={1} fill="url(#colorQ3)" strokeWidth={2} animationDuration={1500} connectNulls />
                  <Area type="monotone" dataKey="Q4" stroke={COLORS[3]} fillOpacity={1} fill="url(#colorQ4)" strokeWidth={2} animationDuration={1500} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.section>

        {/* Goal Distribution Chart */}
        <motion.section variants={itemVariants} className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold">Goal Distribution by Thrust Area ({year})</h3>
          </div>
          
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-white dark:bg-[#0b1326] rounded-2xl border border-gray-200 dark:border-[#464554] shadow-sm p-6 glass-panel">
            {loadingDist ? (
              <SkeletonCard />
            ) : !distData || distData.length === 0 ? (
               <div className="text-center py-10 text-gray-500 dark:text-[#c7c4d7] font-medium">
                 No goal distribution data available for {year}.
               </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} />
                  <XAxis dataKey="thrustArea" tick={{ fontSize: 12, fill: '#c7c4d7' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#c7c4d7' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#464554', opacity: 0.4}} contentStyle={{ backgroundColor: '#171f33', borderColor: '#464554', borderRadius: '8px', color: '#dae2fd' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="MIN" fill={COLORS[0]} radius={[4, 4, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="MAX" fill={COLORS[1]} radius={[4, 4, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="TIMELINE" fill={COLORS[2]} radius={[4, 4, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="ZERO" fill={COLORS[3]} radius={[4, 4, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.section>

        {/* Manager Effectiveness */}
        <motion.section variants={itemVariants} className="mb-10">
          <h3 className="text-lg font-bold mb-4">Manager Effectiveness Index</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Avg Turnaround Time", value: "1.2", unit: "Days", sub: "↓ 14% from last quarter", color: "text-indigo-600 dark:text-[#c0c1ff]" },
              { title: "Inline Edits Ratio", value: "18", unit: "%", sub: "Target tweaks before approval", color: "text-purple-400" },
              { title: "Rework Requests", value: "4", unit: "%", sub: "Of total submissions", color: "text-[#ffb4ab]" }
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-white dark:bg-[#0b1326] rounded-2xl border border-gray-200 dark:border-[#464554] shadow-sm p-6 text-center glass-panel relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-200 dark:to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="text-sm font-medium text-gray-500 dark:text-[#c7c4d7] mb-2">{stat.title}</div>
                <div className={`text-4xl font-black ${stat.color}`}>{stat.value}<span className="text-lg font-medium opacity-80">{stat.unit}</span></div>
                <div className="text-xs text-gray-500 dark:text-[#c7c4d7] mt-3">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </PageWrapper>
  );
}
