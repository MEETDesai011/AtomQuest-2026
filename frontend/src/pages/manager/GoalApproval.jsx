import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { SkeletonRow } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/FeedbackStates';

export default function GoalApproval() {
  const { userId } = useParams();
  const { data: goals, loading, error, refetch } = useApi(`/manager/goals/${userId}`);
  const [reworkModal, setReworkModal] = useState({ open: false, goalId: null });
  const [reworkReason, setReworkReason] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleApprove = async (goalId) => {
    try {
      await api.put(`/manager/goals/${goalId}/approve`);
      toast.success('Goal approved');
      
      const event = new CustomEvent('teams-notify', { 
        detail: `Goal approved successfully. The employee has been notified.` 
      });
      window.dispatchEvent(event);

      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to approve');
    }
  };

  const handleApproveAll = async () => {
    const submittedGoals = goals?.filter(g => g.status === 'SUBMITTED') || [];
    if (submittedGoals.length === 0) return toast.error('No pending goals to approve');
    let successCount = 0;
    for (const goal of submittedGoals) {
      try {
        await api.put(`/manager/goals/${goal.id}/approve`);
        successCount++;
      } catch (err) {
        toast.error(`Failed to approve "${goal.title}"`);
      }
    }
    if (successCount > 0) toast.success(`${successCount} goal(s) approved`);
    refetch();
  };

  const handleRework = async () => {
    if (!reworkReason.trim()) return toast.error('Reason is required');
    try {
      await api.put(`/manager/goals/${reworkModal.goalId}/rework`, { reason: reworkReason });
      toast.success('Goal returned for rework');
      setReworkModal({ open: false, goalId: null });
      setReworkReason('');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to return for rework');
    }
  };

  const startInlineEdit = (goalId, field, currentValue) => {
    setEditingField({ goalId, field });
    setEditValue(currentValue.toString());
  };

  const saveInlineEdit = async (goalId) => {
    const payload = {};
    payload[editingField.field] = Number(editValue);
    try {
      await api.put(`/manager/goals/${goalId}/edit`, payload);
      toast.success('Updated');
      setEditingField(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Goal Approval">
        <div className="bg-white dark:bg-[#0b1326] rounded-xl shadow-sm border border-gray-200 dark:border-[#464554] overflow-hidden">
          {Array(4).fill(0).map((_, i) => <SkeletonRow key={i} cols={6} />)}
        </div>
      </PageWrapper>
    );
  }

  if (error) return <PageWrapper title="Goal Approval"><ErrorState message={error} onRetry={refetch} /></PageWrapper>;

  const pendingCount = goals?.filter(g => g.status === 'SUBMITTED').length || 0;

  return (
    <PageWrapper
      title="Goal Approval"
      actions={
        pendingCount > 0 && (
          <button
            onClick={handleApproveAll}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Approve All Pending ({pendingCount})
          </button>
        )
      }
    >
      {!goals?.length ? (
        <EmptyState message="No goals submitted by this employee yet." />
      ) : (
        <div className="bg-white dark:bg-[#0b1326] rounded-xl shadow-sm border border-gray-200 dark:border-[#464554] overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-[#c7c4d7] whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-[#171f33] text-xs uppercase tracking-wider text-gray-900 dark:text-[#dae2fd] border-b border-gray-200 dark:border-[#464554]">
              <tr>
                <th className="px-6 py-4 font-semibold">Thrust Area</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">UoM</th>
                <th className="px-6 py-4 font-semibold">Target</th>
                <th className="px-6 py-4 font-semibold">Weightage</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#464554]">
              {goals.map(goal => (
                <tr key={goal.id} className="hover:bg-gray-50 dark:hover:bg-[#171f33] transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#dae2fd]">{goal.thrustArea}</td>
                  <td className="px-6 py-4 truncate max-w-xs text-gray-900 dark:text-[#dae2fd]" title={goal.title}>{goal.title}</td>
                  <td className="px-6 py-4">{goal.uom}</td>

                  {/* Inline editable Target */}
                  <td className="px-6 py-4">
                    {editingField?.goalId === goal.id && editingField?.field === 'target' ? (
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border rounded text-sm"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => saveInlineEdit(goal.id)}
                        onKeyDown={e => e.key === 'Enter' && saveInlineEdit(goal.id)}
                        autoFocus
                      />
                    ) : (
                      <span
                        className={goal.status === 'SUBMITTED' ? 'cursor-pointer hover:text-indigo-600 dark:text-[#c0c1ff] underline decoration-dashed' : ''}
                        onClick={() => goal.status === 'SUBMITTED' && startInlineEdit(goal.id, 'target', goal.target)}
                      >
                        {goal.target}
                      </span>
                    )}
                  </td>

                  {/* Inline editable Weightage */}
                  <td className="px-6 py-4">
                    {editingField?.goalId === goal.id && editingField?.field === 'weightage' ? (
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border rounded text-sm"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => saveInlineEdit(goal.id)}
                        onKeyDown={e => e.key === 'Enter' && saveInlineEdit(goal.id)}
                        autoFocus
                      />
                    ) : (
                      <span
                        className={goal.status === 'SUBMITTED' ? 'cursor-pointer hover:text-indigo-600 dark:text-[#c0c1ff] underline decoration-dashed' : ''}
                        onClick={() => goal.status === 'SUBMITTED' && startInlineEdit(goal.id, 'weightage', goal.weightage)}
                      >
                        {goal.weightage}%
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4"><StatusBadge status={goal.status} /></td>
                  <td className="px-6 py-4">
                    {goal.status === 'SUBMITTED' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(goal.id)} className="px-3 py-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium">
                          Approve
                        </button>
                        <button onClick={() => setReworkModal({ open: true, goalId: goal.id })} className="px-3 py-1 text-xs bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors font-medium">
                          Rework
                        </button>
                      </div>
                    ) : goal.isLocked ? (
                      <span className="text-gray-500 dark:text-[#c7c4d7] text-xs">🔒 Locked</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={reworkModal.open} onClose={() => { setReworkModal({ open: false, goalId: null }); setReworkReason(''); }} title="Return for Rework">
        <div className="space-y-4">
          <div>
            <label htmlFor="rework-reason" className="block text-sm font-medium text-gray-900 dark:text-[#dae2fd] mb-1">Reason</label>
            <textarea
              id="rework-reason"
              rows={3}
              className="w-full border border-gray-200 dark:border-[#464554] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#c0c1ff] focus:border-indigo-500 dark:focus:border-[#c0c1ff] outline-none"
              placeholder="Explain why this goal needs rework..."
              value={reworkReason}
              onChange={e => setReworkReason(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setReworkModal({ open: false, goalId: null }); setReworkReason(''); }} className="px-4 py-2 text-sm bg-white dark:bg-[#0b1326] border border-gray-200 dark:border-[#464554] rounded-lg hover:bg-gray-50 dark:bg-[#171f33] transition-colors">
              Cancel
            </button>
            <button onClick={handleRework} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Return for Rework
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
