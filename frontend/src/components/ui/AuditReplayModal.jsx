import { useState } from 'react';
import { X, Play, RotateCcw, FastForward, CheckCircle2 } from 'lucide-react';

export const AuditReplayModal = ({ isOpen, onClose, logs }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !logs) return null;

  // Filter logs to only show actionable changes, sorted chronologically
  const replayLogs = [...logs].reverse().filter(l => l.oldValue && l.newValue);

  const handlePlay = () => {
    setIsPlaying(true);
    let step = currentStep;
    const interval = setInterval(() => {
      if (step < replayLogs.length - 1) {
        step++;
        setCurrentStep(step);
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 1500);
  };

  const currentLog = replayLogs[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1326] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#464554] bg-gray-50 dark:bg-[#171f33]">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-[#c0c1ff]">
            <RotateCcw className="w-5 h-5" />
            <h2 className="text-lg font-bold">Audit Diff Replay Simulator</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-[#c7c4d7] hover:text-gray-500 dark:text-[#c7c4d7]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 dark:bg-[#171f33]">
          {replayLogs.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-[#c7c4d7] py-10">No replayable diffs found in the current log scope.</div>
          ) : (
            <div className="space-y-8">
              {/* Progress Tracker */}
              <div className="flex items-center justify-between mb-8">
                {replayLogs.map((_, i) => (
                  <div key={i} className="flex-1 flex items-center">
                    <div className={`h-2 flex-1 rounded-full ${i <= currentStep ? 'bg-indigo-600 dark:bg-[#c0c1ff]' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    {i < replayLogs.length - 1 && <div className="w-1" />}
                  </div>
                ))}
              </div>

              {/* Main Diff Display */}
              <div className="bg-white dark:bg-[#0b1326] p-6 rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm transition-all duration-300 transform scale-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm font-semibold text-gray-500 dark:text-[#c7c4d7] mb-1">Step {currentStep + 1} of {replayLogs.length}</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-[#dae2fd]">{currentLog.goal?.title || 'System Configuration'}</div>
                  </div>
                  <span className="bg-indigo-600 dark:bg-[#c0c1ff]/10 text-indigo-600 dark:text-[#c0c1ff] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentLog.actionType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 relative">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="text-xs font-bold text-red-800 uppercase mb-2">Previous State</div>
                    <div className="font-mono text-red-600 break-words">{currentLog.oldValue}</div>
                  </div>
                  
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#0b1326] rounded-full p-1 shadow-sm border border-gray-200 dark:border-[#464554] z-10">
                    <FastForward className="w-5 h-5 text-gray-500 dark:text-[#c7c4d7]" />
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-800 uppercase mb-2">New State</div>
                    <div className="font-mono text-emerald-600 break-words font-semibold">{currentLog.newValue}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-[#c7c4d7] bg-gray-50 dark:bg-[#171f33] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Modified by <strong className="text-gray-900 dark:text-[#dae2fd]">{currentLog.user?.name || 'System'}</strong></span>
                  </div>
                  <div>{new Date(currentLog.changedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#464554] bg-white dark:bg-[#0b1326] flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-[#c7c4d7]">
            {isPlaying ? 'Simulating historical drift...' : 'Ready to replay history'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(0)}
              disabled={isPlaying || currentStep === 0}
              className="px-4 py-2 text-gray-500 dark:text-[#c7c4d7] hover:bg-gray-50 dark:bg-[#171f33] rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handlePlay}
              disabled={isPlaying || currentStep >= replayLogs.length - 1}
              className="flex items-center gap-2 bg-indigo-600 dark:bg-[#c0c1ff] hover:brightness-110 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              {isPlaying ? 'Playing...' : 'Play History'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
