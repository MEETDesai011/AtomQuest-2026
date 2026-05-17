import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';

export default function ReportView() {
  const { data: cycles } = useApi('/cycles');
  const [selectedCycleId, setSelectedCycleId] = useState('');

  const { data: reportData, loading, error, refetch } = useApi(
    selectedCycleId ? `/admin/reports/achievement?cycleId=${selectedCycleId}` : null
  );

  const handleExport = async () => {
    if (!selectedCycleId) return toast.error('Select a cycle first');
    try {
      const response = await api.get(`/admin/reports/export?cycleId=${selectedCycleId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const cycle = cycles?.find(c => c.id === selectedCycleId);
      link.setAttribute('download', `achievement-report-${cycle?.year}-${cycle?.phase}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch (err) {
      toast.error('Failed to export report');
    }
  };

  // Flatten report data for the table
  const flatData = [];
  if (reportData) {
    for (const emp of reportData) {
      for (const goal of emp.goals) {
        flatData.push({
          employeeName: emp.employeeName,
          department: emp.department,
          ...goal,
        });
      }
    }
  }

  const columns = [
    { label: 'Employee', key: 'employeeName', render: r => <span className="font-medium text-gray-900 dark:text-[#dae2fd]">{r.employeeName}</span> },
    { label: 'Department', key: 'department' },
    { label: 'Thrust Area', key: 'thrustArea' },
    { label: 'Goal Title', key: 'title', render: r => <span className="truncate max-w-xs block" title={r.title}>{r.title}</span> },
    { label: 'UoM', key: 'uom' },
    { label: 'Target', key: 'target' },
    { label: 'Actual', key: 'actual', render: r => r.actual != null ? r.actual : '—' },
    { label: 'Progress', key: 'progressScore', render: r => r.progressScore != null ? <ProgressBar score={r.progressScore} /> : '—' },
    { label: 'Status', key: 'status', render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <PageWrapper
      title="Achievement Reports"
      actions={
        selectedCycleId && (
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Export to Excel
          </button>
        )
      }
    >
      {/* Cycle selector */}
      <div className="mb-6 max-w-sm">
        <label htmlFor="cycle-select" className="block text-sm font-medium text-gray-900 dark:text-[#dae2fd] mb-1.5">Select Cycle</label>
        <select
          id="cycle-select"
          className="w-full px-3 py-2 border border-gray-200 dark:border-[#464554] rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#c0c1ff] focus:border-indigo-500 dark:focus:border-[#c0c1ff] outline-none"
          value={selectedCycleId}
          onChange={e => setSelectedCycleId(e.target.value)}
        >
          <option value="">— Choose a cycle —</option>
          {cycles?.map(c => (
            <option key={c.id} value={c.id}>{c.year} — {c.phase}</option>
          ))}
        </select>
      </div>

      {!selectedCycleId ? (
        <div className="bg-gray-50 dark:bg-[#171f33] border border-dashed border-gray-200 dark:border-[#464554] rounded-xl p-12 text-center text-gray-500 dark:text-[#c7c4d7]">
          Select a cycle above to view achievement data.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={flatData}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyMessage="No achievement data for this cycle."
        />
      )}
    </PageWrapper>
  );
}
