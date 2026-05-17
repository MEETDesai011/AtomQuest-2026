import { useApi } from '../../hooks/useApi';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable } from '../../components/ui/DataTable';
import { SkeletonRow } from '../../components/ui/Skeleton';
import { AlertCircle, Clock } from 'lucide-react';

export default function EscalationLog() {
  const { data: logs, loading } = useApi('/admin/escalations');

  const columns = [
    {
      header: 'Timestamp',
      accessor: (row) => (
        <span className="text-gray-500 dark:text-[#c7c4d7] font-mono text-sm whitespace-nowrap">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      )
    },
    {
      header: 'User / Target',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-[#dae2fd]">{row.user?.name || 'System'}</div>
          <div className="text-xs text-gray-500 dark:text-[#c7c4d7]">{row.user?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'Escalation Type',
      accessor: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          {row.type}
        </span>
      )
    },
    {
      header: 'Details',
      accessor: (row) => <span className="text-gray-900 dark:text-[#dae2fd]">{row.message}</span>
    }
  ];

  return (
    <PageWrapper title="System Escalation Dashboard">
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
        <Clock className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-amber-900">Proactive Escalation Engine</h3>
          <p className="text-sm text-amber-700 mt-1">
            This dashboard displays system-generated warnings for overdue actions, missing submissions, and uncompleted check-ins. It is populated by the daily Cron job sweep.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={logs || []} 
            keyExtractor={(row) => row.id} 
            emptyMessage="No escalations logged. System health is optimal."
          />
        )}
      </div>
    </PageWrapper>
  );
}
