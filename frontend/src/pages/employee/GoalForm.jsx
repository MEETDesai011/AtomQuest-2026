import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { FormField } from '../../components/ui/FormField';
import { THRUST_AREAS, UOM } from '../../constants';

export default function GoalForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const { data: cycles } = useApi('/cycles');
  const activeCycle = cycles?.find(c => c.isActive && c.phase === 'GOAL_SETTING');
  
  const { data: existingGoals, loading: loadingGoals } = useApi(
    activeCycle ? `/goals/mine?cycleId=${activeCycle.id}` : null
  );

  const goalToEdit = existingGoals?.find(g => g.id === editId);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isDirty }, reset } = useForm({
    defaultValues: {
      thrustArea: 'Revenue',
      uom: 'MIN',
      weightage: 10
    }
  });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (goalToEdit) {
      reset({
        thrustArea: goalToEdit.thrustArea,
        title: goalToEdit.title,
        description: goalToEdit.description || '',
        uom: goalToEdit.uom,
        target: goalToEdit.target,
        weightage: goalToEdit.weightage,
      });
    }
  }, [goalToEdit, reset]);

  const currentWeightage = watch('weightage') || 0;
  const otherGoalsWeight = (existingGoals || [])
    .filter(g => g.id !== editId)
    .reduce((sum, g) => sum + g.weightage, 0);
  const totalProjectedWeight = otherGoalsWeight + Number(currentWeightage);

  const onSubmit = async (data) => {
    if (!activeCycle) return toast.error('No active cycle');
    if (totalProjectedWeight > 100) return toast.error('Total weightage cannot exceed 100%');

    try {
      const payload = { ...data, cycleId: activeCycle.id, target: Number(data.target), weightage: Number(data.weightage) };
      
      if (editId) {
        if (goalToEdit?.sharedFromId) {
          // If shared, can only update weightage
          await api.put(`/goals/${editId}`, { weightage: payload.weightage });
        } else {
          await api.put(`/goals/${editId}`, payload);
        }
        toast.success('Goal updated');
      } else {
        await api.post('/goals', payload);
        toast.success('Goal created');
      }
      navigate('/employee/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  if (loadingGoals) return <PageWrapper>Loading...</PageWrapper>;
  if (!activeCycle) return <PageWrapper><div className="p-4 bg-orange-50 text-orange-800 rounded-lg">Goal setting is not currently active.</div></PageWrapper>;

  const isShared = !!goalToEdit?.sharedFromId;

  return (
    <PageWrapper title={editId ? 'Edit Goal' : 'Add New Goal'}>
      <div className="bg-white dark:bg-[#0b1326] rounded-xl shadow-sm border border-gray-200 dark:border-[#464554] p-6 max-w-2xl">
        
        {isShared && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 text-sm">
            ℹ️ This is a shared team goal. You can only modify its weightage.
          </div>
        )}

        {import.meta.env.VITE_ENABLE_AI_INSIGHTS !== 'false' && !isShared && !editId && (
          <div className="mb-6 flex justify-end">
            <button 
              type="button"
              onClick={() => {
                reset({
                  thrustArea: 'Innovation',
                  title: 'Implement Predictive AI Model for Logistics',
                  description: 'Develop and deploy a machine learning model to predict supply chain delays with 90% accuracy.',
                  uom: 'MAX',
                  target: 90,
                  weightage: 20
                });
                toast.success('AI Goal Suggested successfully!');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-700 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Auto-Suggest Goal
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Thrust Area"
            type="select"
            disabled={isShared}
            {...register('thrustArea')}
            error={errors.thrustArea}
          >
            {THRUST_AREAS.map(ta => <option key={ta} value={ta}>{ta}</option>)}
          </FormField>

          <FormField
            label="Goal Title"
            type="text"
            disabled={isShared}
            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 chars' } })}
            error={errors.title}
          />

          <FormField
            label="Description (Optional)"
            type="textarea"
            rows="3"
            disabled={isShared}
            {...register('description')}
            error={errors.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Unit of Measurement"
              type="select"
              disabled={isShared}
              {...register('uom')}
              error={errors.uom}
            >
              {Object.keys(UOM).map(u => <option key={u} value={u}>{u}</option>)}
            </FormField>

            <FormField
              label="Target Value"
              type="number"
              step="any"
              disabled={isShared}
              {...register('target', { 
                required: 'Target required',
                min: { value: 0, message: 'Must be >= 0' } 
              })}
              error={errors.target}
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-[#464554]">
            <div className="flex justify-between items-end">
              <div className="w-1/2">
                <FormField
                  label="Weightage (%)"
                  type="number"
                  {...register('weightage', { 
                    required: 'Required', 
                    min: { value: 10, message: 'Min 10%' },
                    max: { value: 100, message: 'Max 100%' }
                  })}
                  error={errors.weightage}
                />
              </div>
              <div className={`text-sm font-medium pb-2 ${totalProjectedWeight > 100 ? 'text-red-600' : 'text-gray-500 dark:text-[#c7c4d7]'}`}>
                Total Project Weight: {totalProjectedWeight}% / 100%
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 dark:bg-[#c0c1ff] text-white rounded-lg text-sm font-medium hover:brightness-110 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Goal'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee/dashboard')}
              className="px-6 py-2 bg-white dark:bg-[#0b1326] text-gray-900 dark:text-[#dae2fd] border border-gray-200 dark:border-[#464554] hover:bg-gray-50 dark:bg-[#171f33] rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
