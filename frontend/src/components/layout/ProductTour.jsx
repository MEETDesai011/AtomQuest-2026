import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const ProductTour = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show once per session for demo purposes
    if (!sessionStorage.getItem('tourCompleted')) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = () => {
    setIsVisible(false);
    sessionStorage.setItem('tourCompleted', 'true');
  };

  if (!isVisible) return null;

  const steps = [
    {
      title: 'Welcome to AtomQuest!',
      content: 'This is your centralized hub for tracking Key Performance Indicators and OKRs.',
    },
    {
      title: 'Set Your Goals',
      content: 'Click "Add Goal" to define your objectives. Make sure your total weightage equals exactly 100%.',
    },
    {
      title: 'Submit for Approval',
      content: 'Once your goals total 100%, click "Submit All Goals" to send them to your manager for review.',
    },
    {
      title: 'Log Achievements',
      content: 'Throughout the quarter, return here to log your actual metrics. Our engine will calculate your precise progress score.',
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1326] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-indigo-600 dark:bg-[#c0c1ff] p-6 text-white relative">
          <button 
            onClick={completeTour}
            className="absolute top-4 right-4 text-indigo-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-gray-50 dark:bg-[#171f33] rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-xl font-bold">{steps[step].title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-500 dark:text-[#c7c4d7] mb-8">{steps[step].content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-600 dark:bg-[#c0c1ff]' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={completeTour}
                className="text-sm font-medium text-gray-500 dark:text-[#c7c4d7] hover:text-gray-900 dark:text-[#dae2fd]"
              >
                Skip Tour
              </button>
              {step < steps.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-4 py-2 bg-indigo-600 dark:bg-[#c0c1ff] text-white rounded-lg text-sm font-medium hover:brightness-110"
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={completeTour}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
