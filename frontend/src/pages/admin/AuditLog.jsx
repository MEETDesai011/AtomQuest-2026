import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable } from '../../components/ui/DataTable';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { AuditReplayModal } from '../../components/ui/AuditReplayModal';

export default function AuditLog() {
  const { data: logs, loading, error, refetch } = useApi('/admin/audit');
  const [isReplayOpen, setIsReplayOpen] = useState(false);

  const columns = [
    {
      label: 'Changed At',
      key: 'changedAt',
      render: r => (
        <span className="text-xs text-gray-500 dark:text-[#c7c4d7]">{new Date(r.changedAt).toLocaleString()}</span>
      ),
    },
    {
      label: 'Action',
      key: 'actionType',
      render: r => {
        const colors = {
          APPROVED: 'bg-green-50 text-green-700',
          RETURNED_FOR_REWORK: 'bg-orange-50 text-orange-700',
          INLINE_EDIT: 'bg-blue-50 text-blue-700',
          ADMIN_UNLOCK: 'bg-purple-50 text-purple-700',
        };
        return (
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors[r.actionType] || 'bg-gray-50 dark:bg-[#171f33] text-gray-900 dark:text-[#dae2fd]'}`}>
            {r.actionType}
          </span>
        );
      },
    },
    {
      label: 'Goal',
      key: 'goal',
      render: r => <span className="text-gray-900 dark:text-[#dae2fd] font-medium truncate max-w-[200px] block">{r.goal?.title || '—'}</span>,
    },
    {
      label: 'Changed By',
      key: 'user',
      render: r => r.user?.name || '—',
    },
    { label: 'Field', key: 'fieldName' },
    {
      label: 'Changes',
      key: 'changes',
      render: r => (
        <div className="flex items-center gap-2 text-xs font-mono bg-gray-50 dark:bg-[#171f33] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#464554] inline-flex">
          <span className="text-red-600 line-through decoration-red-300 opacity-80">{r.oldValue || 'null'}</span>
          <ArrowRight className="w-3 h-3 text-gray-500 dark:text-[#c7c4d7]" />
          <span className="text-emerald-600 font-semibold">{r.newValue || 'null'}</span>
        </div>
      ),
    },
  ];

  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return;
    
    // Create CSV content
    const headers = ['Timestamp', 'Action', 'Goal ID', 'Goal Title', 'Changed By', 'Field', 'Old Value', 'New Value'];
    const rows = logs.map(l => [
      new Date(l.changedAt).toISOString(),
      l.actionType,
      l.goalId || '',
      `"${(l.goal?.title || '').replace(/"/g, '""')}"`,
      `"${(l.user?.name || '').replace(/"/g, '""')}"`,
      l.fieldName || '',
      `"${(l.oldValue || '').replace(/"/g, '""')}"`,
      `"${(l.newValue || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(',')).join('\n');
      
    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <AuditReplayModal isOpen={isReplayOpen} onClose={() => setIsReplayOpen(false)} logs={logs} />
      <PageWrapper 
        title="Audit Log"
        actions={
          <div className="flex gap-3">
            <button 
              onClick={() => setIsReplayOpen(true)}
              disabled={loading || !logs?.length}
              className="flex items-center gap-2 bg-indigo-600 dark:bg-[#c0c1ff]/10 text-indigo-600 dark:text-[#c0c1ff] border border-indigo-200 dark:border-[#c0c1ff]/30 hover:bg-indigo-600 dark:bg-[#c0c1ff]/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Replay History
            </button>
            <button 
              onClick={handleExportCSV}
              disabled={loading || !logs?.length}
              className="bg-white dark:bg-[#0b1326] text-gray-900 dark:text-[#dae2fd] border border-gray-200 dark:border-[#464554] hover:bg-gray-50 dark:bg-[#171f33] px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyMessage="No audit log entries found."
        />
      </PageWrapper>
    </>
  );
}
