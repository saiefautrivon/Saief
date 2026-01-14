
import React, { useState } from 'react';
import { StrictModeSettings } from '../types';
import { getTodayDate } from '../utils';

interface OnboardingProps {
  onComplete: (settings: StrictModeSettings) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [target, setTarget] = useState(30);
  const [duration, setDuration] = useState(30);

  const handleSubmit = () => {
    onComplete({
      startDate: getTodayDate(),
      durationDays: duration,
      dailyTarget: target,
      isConfigured: true
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Set Your Standard.</h1>
        <p className="text-slate-400 text-lg max-w-sm mx-auto font-medium">Outreach is about discipline, not motivation. Commit now.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] card-shadow border border-slate-100 dark:border-slate-800 space-y-10">
        <div className="space-y-6">
          <label className="block">
            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 block">Daily Outreach Target</span>
            <div className="grid grid-cols-4 gap-3">
              {[30, 50, 100, 200].map(val => (
                <button 
                  key={val}
                  onClick={() => setTarget(val)}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 border-2 ${target === val ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 block">Commitment Duration</span>
            <div className="grid grid-cols-4 gap-3">
              {[7, 15, 30, 90].map(val => (
                <button 
                  key={val}
                  onClick={() => setDuration(val)}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 border-2 ${duration === val ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                >
                  {val}d
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            Strict Mode Warning
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Once you start, the daily target cannot be reduced. If you miss a day, your streak will break. This is how leaders are built.
          </p>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xl hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-slate-200 dark:shadow-none"
        >
          I Accept. Start My Cycle.
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
