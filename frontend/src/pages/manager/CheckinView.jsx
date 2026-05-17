import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SkeletonRow } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/FeedbackStates';

export default function CheckinView() {
  const { userId } = useParams();
  const { data: goals, loading, error, refetch } = useApi(`/manager/checkins/${userId}`);

  if (loading) {
    return (
      <PageWrapper title="Check-in View">
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <SkeletonRow key={i} cols={5} />)}
        </div>
      </PageWrapper>
    );
  }

  if (error) return <PageWrapper title="Check-in View"><ErrorState message={error} onRetry={refetch} /></PageWrapper>;
  if (!goals?.length) return <PageWrapper title="Check-in View"><EmptyState message="No approved goals found for this employee." /></PageWrapper>;

  return (
    <PageWrapper title="Check-in View">
      <div className="space-y-6">
        {goals.map(goal => (
          <GoalCheckinCard key={goal.id} goal={goal} onCommentAdded={refetch} />
        ))}
      </div>
    </PageWrapper>
  );
}

function GoalCheckinCard({ goal, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const achievement = goal.achievements?.[0];
  const comments = achievement?.comments || [];

  const handlePostComment = async () => {
    if (!comment.trim()) return toast.error('Comment cannot be empty');
    if (!achievement) return toast.error('No achievement record exists for this goal');

    setIsPosting(true);
    try {
      await api.post(`/manager/checkins/${achievement.id}/comment`, { comment });
      toast.success('Comment posted');
      setComment('');
      onCommentAdded();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b1326] rounded-xl shadow-sm border border-gray-200 dark:border-[#464554] overflow-hidden">
      {/* Goal header */}
      <div className="p-5 border-b border-gray-200 dark:border-[#464554]">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-[#dae2fd]">{goal.title}</h3>
            <div className="flex gap-3 mt-1.5">
              <span className="text-xs font-semibold text-indigo-600 dark:text-[#c0c1ff] bg-indigo-600 dark:bg-[#c0c1ff]/10 px-2 py-0.5 rounded">{goal.thrustArea}</span>
              <span className="text-xs font-medium text-gray-500 dark:text-[#c7c4d7] bg-gray-50 dark:bg-[#171f33] px-2 py-0.5 rounded">{goal.uom}</span>
              <span className="text-xs text-gray-500 dark:text-[#c7c4d7]">Target: {goal.target}</span>
            </div>
          </div>
          <StatusBadge status={achievement?.status || 'NOT_STARTED'} />
        </div>

        {/* Achievement data */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-[#c7c4d7] mb-1">Actual Achievement</div>
            <div className="text-lg font-bold text-gray-900 dark:text-[#dae2fd]">
              {achievement?.actualValue != null ? achievement.actualValue : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-[#c7c4d7] mb-1">Progress Score</div>
            <ProgressBar score={achievement?.progressScore ?? 0} />
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="p-5 bg-gray-50 dark:bg-[#171f33]/50">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-[#c7c4d7] uppercase tracking-wider mb-3">Comments ({comments.length})</h4>

        {comments.length > 0 && (
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {comments.map(c => (
              <div key={c.id} className="bg-white dark:bg-[#0b1326] rounded-lg p-3 border border-gray-200 dark:border-[#464554]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-900 dark:text-[#dae2fd]">{c.manager?.name || 'Manager'}</span>
                  <span className="text-xs text-gray-500 dark:text-[#c7c4d7]">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-[#dae2fd]">{c.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <label htmlFor={`comment-${goal.id}`} className="sr-only">Add a comment</label>
          <textarea
            id={`comment-${goal.id}`}
            rows={2}
            className="flex-1 border border-gray-200 dark:border-[#464554] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0b1326] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#c0c1ff] focus:border-indigo-500 dark:focus:border-[#c0c1ff] outline-none resize-none"
            placeholder="Add your feedback..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            onClick={handlePostComment}
            disabled={isPosting}
            className="self-end px-4 py-2 bg-indigo-600 dark:bg-[#c0c1ff] text-white rounded-lg text-sm font-medium hover:brightness-110 disabled:opacity-50 transition-colors"
          >
            {isPosting ? '...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
