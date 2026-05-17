import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { FormField } from '../../components/ui/FormField';

export default function AchievementEntry() {
  const { data: cycles } = useApi('/cycles');
  const activePerformanceCycle = cycles?.find(c => c.isActive && ['Q1', 'Q2', 'Q3', 'Q4'].includes(c.phase));
  
  const { data: goals, loading, refetch } = useApi(
    activePerformanceCycle ? `/goals/mine?cycleId=${activePerformanceCycle.id}` : null
  );

  const approvedGoals = goals?.filter(g => g.status === 'APPROVED') || [];

  if (!activePerformanceCycle) {
    return (
      <PageWrapper title="Achievement Entry">
        <div className="bg-orange-50 border border-orange-100 text-orange-800 p-4 rounded-xl">
          Achievement entry is not open during this period.
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`Achievement Entry - ${activePerformanceCycle.phase}`}>
      {loading ? (
        <div>Loading...</div>
      ) : approvedGoals.length === 0 ? (
        <div className="bg-white dark:bg-[#0b1326] p-8 text-center text-gray-500 dark:text-[#c7c4d7] rounded-xl border border-gray-200 dark:border-[#464554]">
          No approved goals found for this cycle.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {approvedGoals.map(goal => (
            <GoalAchievementCard key={goal.id} goal={goal} cycleId={activePerformanceCycle.id} onSaved={refetch} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

function GoalAchievementCard({ goal, cycleId, onSaved }) {
  const existingAch = goal.achievements?.find(a => a.cycleId === cycleId);
  const [actual, setActual] = useState(existingAch?.actualValue ?? '');
  const [status, setStatus] = useState(existingAch?.status ?? 'NOT_STARTED');
  const [isSaving, setIsSaving] = useState(false);

  // Client-side preview computation (matches backend)
  const computeScore = () => {
    if (actual === '') return 0;
    const act = Number(actual);
    const tgt = goal.target;
    switch(goal.uom) {
      case 'MIN': return Math.min((act / tgt) * 100, 100);
      case 'MAX': return act === 0 ? 0 : Math.min((tgt / act) * 100, 100);
      case 'ZERO': return act === 0 ? 100 : 0;
      case 'TIMELINE': return act === 1 ? 100 : 0; // Simplified for UI preview
      default: return 0;
    }
  };

  const currentScore = computeScore();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/achievements', {
        goalId: goal.id,
        cycleId,
        actualValue: actual === '' ? null : Number(actual),
        status
      });
      toast.success('Achievement saved');
      onSaved();
    } catch (error) {
      toast.error('Failed to save achievement');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b1326] rounded-xl shadow-sm border border-gray-200 dark:border-[#464554] p-5 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-[#c0c1ff] bg-indigo-600 dark:bg-[#c0c1ff]/10 px-2 py-1 rounded">
          {goal.thrustArea}
        </span>
        <span className="text-xs font-medium text-gray-500 dark:text-[#c7c4d7] bg-gray-50 dark:bg-[#171f33] px-2 py-1 rounded">
          {goal.uom}
        </span>
      </div>
      
      <h3 className="text-sm font-bold text-gray-900 dark:text-[#dae2fd] mb-1">{goal.title}</h3>
      <div className="text-xs text-gray-500 dark:text-[#c7c4d7] mb-4">Target: {goal.target} {goal.uom !== 'TIMELINE' ? goal.uom : ''}</div>

      <div className="space-y-4 mt-auto">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Actual"
            type="number"
            step="any"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
          />
          <FormField
            label="Status"
            type="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="ON_TRACK">On Track</option>
            <option value="COMPLETED">Completed</option>
          </FormField>
        </div>

        <div className="pt-2">
          <div className="text-xs text-gray-500 dark:text-[#c7c4d7] mb-1 flex justify-between">
            <span>Progress Score Preview</span>
            <span className="font-medium">{currentScore.toFixed(1)}%</span>
          </div>
          <ProgressBar score={currentScore} />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-2 bg-indigo-600 dark:bg-[#c0c1ff]/10 text-indigo-600 dark:text-[#c0c1ff] hover:bg-indigo-600 dark:bg-[#c0c1ff]/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Achievement'}
        </button>
      </div>
    </div>
  );
}
