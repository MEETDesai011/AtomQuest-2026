import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApi } from '../../hooks/useApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable } from '../../components/ui/DataTable';
import { FormField } from '../../components/ui/FormField';
import { PHASES } from '../../constants';

export default function CycleManager() {
  const { data: cycles, loading, error, refetch } = useApi('/cycles');
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      phase: 'GOAL_SETTING',
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        year: Number(data.year),
        windowOpen: new Date(data.windowOpen).toISOString(),
        windowClose: new Date(data.windowClose).toISOString(),
        isActive: false,
      };

      if (new Date(data.windowClose) <= new Date(data.windowOpen)) {
        return toast.error('Window Close must be after Window Open');
      }

      await api.post('/admin/cycles', payload);
      toast.success('Cycle created');
      reset();
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create cycle');
    }
  };

  const toggleActive = async (cycleId, currentStatus) => {
    try {
      await api.put(`/admin/cycles/${cycleId}`, { isActive: !currentStatus });
      toast.success(`Cycle ${!currentStatus ? 'activated' : 'deactivated'}`);
      refetch();
    } catch (err) {
      toast.error('Failed to update cycle');
    }
  };

  const columns = [
    { label: 'Year', key: 'year', render: r => <span className="font-medium text-gray-900 dark:text-[#dae2fd]">{r.year}</span> },
    { label: 'Phase', key: 'phase', render: r => <span className="text-xs font-semibold uppercase bg-indigo-600 dark:bg-[#c0c1ff]/10 text-indigo-600 dark:text-[#c0c1ff] px-2 py-0.5 rounded">{r.phase}</span> },
    { label: 'Window Open', key: 'windowOpen', render: r => new Date(r.windowOpen).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) },
    { label: 'Window Close', key: 'windowClose', render: r => new Date(r.windowClose).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) },
    {
      label: 'Active',
      key: 'isActive',
      render: r => (
        <button
          onClick={() => toggleActive(r.id, r.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${r.isActive ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
          aria-label={`Toggle active status for ${r.phase}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-[#0b1326] transition-transform ${r.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      )
    },
  ];

  return (
    <PageWrapper
      title="Cycle Manager"
      actions={
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 dark:bg-[#c0c1ff] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-colors"
        >
          {showForm ? 'Cancel' : 'Create Cycle'}
        </button>
      }
    >
      {showForm && (
        <div className="bg-white dark:bg-[#0b1326] rounded-xl shadow-sm border border-gray-200 dark:border-[#464554] p-6 mb-6 max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Year"
                type="number"
                {...register('year', { required: 'Year is required' })}
                error={errors.year}
              />
              <FormField
                label="Phase"
                type="select"
                {...register('phase')}
                error={errors.phase}
              >
                {Object.keys(PHASES).map(p => <option key={p} value={p}>{p}</option>)}
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Window Open"
                type="date"
                {...register('windowOpen', { required: 'Required' })}
                error={errors.windowOpen}
              />
              <FormField
                label="Window Close"
                type="date"
                {...register('windowClose', { required: 'Required' })}
                error={errors.windowClose}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 dark:bg-[#c0c1ff] text-white rounded-lg text-sm font-medium hover:brightness-110 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Cycle'}
            </button>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={cycles}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No cycles created yet."
      />
    </PageWrapper>
  );
}
