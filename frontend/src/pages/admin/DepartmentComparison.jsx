import { useState } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DepartmentComparison() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2');

  // Hardcoded comparison data updated for May 2026
  // Q1 is complete. Q2 is mid-way. Q3 and Q4 are empty.
  const comparisonData = [
    { department: 'Sales', Q1: 78, Q2: 45, Q3: null, Q4: null },
    { department: 'Engineering', Q1: 85, Q2: 52, Q3: null, Q4: null },
    { department: 'HR', Q1: 90, Q2: 48, Q3: null, Q4: null },
    { department: 'Marketing', Q1: 72, Q2: 35, Q3: null, Q4: null },
    { department: 'Logistics', Q1: 88, Q2: 42, Q3: null, Q4: null },
    { department: 'Finance', Q1: 91, Q2: 55, Q3: null, Q4: null },
  ];

  const managerMetrics = [
    { manager: 'Sarah Smith', department: 'Engineering', avgTurnaround: 1.2, completionRate: 52, teamSize: 8 },
    { manager: 'David Park', department: 'Sales', avgTurnaround: 2.1, completionRate: 45, teamSize: 12 },
    { manager: 'Lisa Chen', department: 'HR', avgTurnaround: 0.8, completionRate: 48, teamSize: 5 },
    { manager: 'Tom Wilson', department: 'Logistics', avgTurnaround: 3.5, completionRate: 42, teamSize: 15 },
  ];

  return (
    <PageWrapper title="Department Comparison Analytics">
      {/* Quarter Selector */}
      <div className="flex gap-2 mb-8">
        {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
          <button
            key={q}
            onClick={() => setSelectedQuarter(q)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selectedQuarter === q 
                ? 'bg-indigo-600 dark:bg-[#c0c1ff] text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-white dark:bg-[#0b1326] text-gray-500 dark:text-[#c7c4d7] border border-gray-200 dark:border-[#464554] hover:bg-gray-50 dark:bg-[#171f33]'
            }`}
          >
            {q} 2026
          </button>
        ))}
      </div>

      {/* Side-by-Side Department Chart */}
      <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm p-6 mb-8 glass-panel">
        <h3 className="text-lg font-bold mb-4">Department vs Department — Completion %</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparisonData} margin={{ bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 12, fill: '#c7c4d7' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#c7c4d7' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#171f33', borderColor: '#464554', borderRadius: '8px', color: '#dae2fd' }} cursor={{fill: '#464554', opacity: 0.4}} formatter={(v) => [v ? `${v}%` : 'N/A']} />
            <Legend iconType="circle" />
            <Bar dataKey="Q1" fill="#c7c4d7" name="Q1 (Completed)" radius={[4, 4, 0, 0]} opacity={0.5} />
            <Bar dataKey={selectedQuarter} fill="#c0c1ff" name={`${selectedQuarter} (Selected)`} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Manager Effectiveness Comparison Table */}
      <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm overflow-hidden glass-panel">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#464554]">
          <h3 className="text-lg font-bold">Manager Effectiveness (Current Active Quarter)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#171f33]">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Manager</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Department</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Avg Turnaround</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Current Rate</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Team Size</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Trajectory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#464554]">
              {managerMetrics.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:bg-[#171f33] transition-colors">
                  <td className="px-6 py-4 font-bold">{m.manager}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-[#c7c4d7]">{m.department}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${m.avgTurnaround <= 1.5 ? 'text-emerald-500' : m.avgTurnaround <= 2.5 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {m.avgTurnaround} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.completionRate >= 50 ? 'bg-emerald-500' : m.completionRate >= 40 ? 'bg-indigo-600 dark:bg-[#c0c1ff]' : 'bg-amber-500'}`} style={{ width: `${m.completionRate}%` }} />
                      </div>
                      <span className="text-sm font-bold">{m.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-[#c7c4d7]">{m.teamSize}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      m.completionRate >= 50 ? 'bg-emerald-500/10 text-emerald-500' :
                      m.completionRate >= 40 ? 'bg-indigo-600 dark:bg-[#c0c1ff]/10 text-indigo-600 dark:text-[#c0c1ff]' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {m.completionRate >= 50 ? 'On Track' : m.completionRate >= 40 ? 'Stable' : 'At Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
