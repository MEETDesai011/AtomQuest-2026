import { PageWrapper } from '../../components/layout/PageWrapper';

export default function GoalDependencyGraph() {
  // Simulated dependency data
  const goals = [
    { id: 'G1', title: 'Q4 Revenue Target', status: 'APPROVED', deps: [], x: 400, y: 30 },
    { id: 'G2', title: 'Close 5 Enterprise Deals', status: 'SUBMITTED', deps: ['G1'], x: 200, y: 140 },
    { id: 'G3', title: 'Launch Partner Program', status: 'DRAFT', deps: ['G1'], x: 600, y: 140 },
    { id: 'G4', title: 'Hire 3 Account Execs', status: 'APPROVED', deps: ['G2'], x: 100, y: 260 },
    { id: 'G5', title: 'Build Sales Enablement Deck', status: 'SUBMITTED', deps: ['G2', 'G3'], x: 400, y: 260 },
    { id: 'G6', title: 'Onboard Channel Partners', status: 'DRAFT', deps: ['G3'], x: 680, y: 260 },
    { id: 'G7', title: 'Train New Hires on CRM', status: 'DRAFT', deps: ['G4'], x: 100, y: 380 },
  ];

  const statusColors = {
    APPROVED: { fill: '#dcfce7', stroke: '#16a34a', text: '#15803d' },
    SUBMITTED: { fill: '#dbeafe', stroke: '#2563eb', text: '#1d4ed8' },
    DRAFT: { fill: '#fef3c7', stroke: '#d97706', text: '#b45309' },
  };

  const getGoalById = (id) => goals.find(g => g.id === id);

  return (
    <PageWrapper title="Goal Dependency Graph">
      <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm p-6 overflow-x-auto">
        <svg width="800" height="440" className="mx-auto">
          {/* Draw Edges */}
          {goals.map(goal =>
            goal.deps.map(depId => {
              const parent = getGoalById(depId);
              if (!parent) return null;
              return (
                <line
                  key={`${depId}-${goal.id}`}
                  x1={parent.x}
                  y1={parent.y + 40}
                  x2={goal.x}
                  y2={goal.y}
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  markerEnd="url(#arrowhead)"
                />
              );
            })
          )}

          {/* Arrow Marker */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Draw Nodes */}
          {goals.map(goal => {
            const colors = statusColors[goal.status] || statusColors.DRAFT;
            return (
              <g key={goal.id} className="cursor-pointer" style={{ transition: 'transform 0.2s' }}>
                <rect
                  x={goal.x - 90}
                  y={goal.y}
                  width={180}
                  height={44}
                  rx={10}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={2}
                />
                <text
                  x={goal.x}
                  y={goal.y + 18}
                  textAnchor="middle"
                  className="text-xs font-bold"
                  fill={colors.text}
                >
                  {goal.id}: {goal.title.length > 22 ? goal.title.slice(0, 22) + '…' : goal.title}
                </text>
                <text
                  x={goal.x}
                  y={goal.y + 34}
                  textAnchor="middle"
                  className="text-[10px]"
                  fill={colors.text}
                >
                  {goal.status}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-[#464554]">
          {Object.entries(statusColors).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.fill, border: `2px solid ${colors.stroke}` }} />
              <span className="text-xs font-medium text-gray-500 dark:text-[#c7c4d7]">{status}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 2" /></svg>
            <span className="text-xs font-medium text-gray-500 dark:text-[#c7c4d7]">Depends On</span>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
