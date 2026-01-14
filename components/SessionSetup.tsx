
import React from 'react';

interface SessionSetupProps {
  onStart: (limit: number) => void;
  availableCount: number;
}

const SessionSetup: React.FC<SessionSetupProps> = ({ onStart, availableCount }) => {
  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Daily Outreach</h1>
        <p className="text-slate-500 text-lg">Choose your rhythm for today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[10, 20, 30].map(size => (
          <button
            key={size}
            disabled={availableCount === 0}
            onClick={() => onStart(size)}
            className="group relative w-full p-8 bg-white border border-slate-100 rounded-3xl card-shadow hover:border-slate-300 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <span className="block text-2xl font-bold text-slate-800">{size} Leads</span>
                <span className="text-slate-400 text-sm">Targeted focused session</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-400">
        {availableCount} lead{availableCount !== 1 ? 's' : ''} currently awaiting your action.
      </p>
    </div>
  );
};

export default SessionSetup;
