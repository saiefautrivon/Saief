
import React, { useState, useEffect } from 'react';
import { generateLead, detectPlatform } from '../utils';
import { Lead, SocialPlatform } from '../types';
import { PLATFORMS } from '../constants';

interface LeadEntryProps {
  onAdd: (lead: Lead) => void;
  onClose: () => void;
}

const LeadEntry: React.FC<LeadEntryProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    company: '',
    url: '',
    notes: ''
  });
  
  const [detected, setDetected] = useState<{ platform: SocialPlatform } | null>(null);

  useEffect(() => {
    if (formData.url && formData.url.length > 3) {
      const { platform } = detectPlatform(formData.url);
      setDetected({ platform });
    } else {
      setDetected(null);
    }
  }, [formData.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;
    const newLead = generateLead(formData);
    onAdd(newLead);
    onClose();
  };

  const platformInfo = detected ? PLATFORMS[detected.platform] || PLATFORMS.Generic : null;

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 card-shadow border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Add New Prospect</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Fuel your outreach ritual.</p>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
            <input 
              required
              autoFocus
              type="text" 
              placeholder="e.g. Marcus Aurelius"
              className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all text-slate-900 dark:text-white font-bold"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
            <input 
              type="text" 
              placeholder="e.g. Rome Inc."
              className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all text-slate-900 dark:text-white font-bold"
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Social URL or Email *</label>
          <div className="relative">
            <input 
              required
              type="text" 
              placeholder="LinkedIn URL, Email, IG handle..."
              className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all text-slate-900 dark:text-white font-bold pr-16"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
            {platformInfo && (
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl ${platformInfo.bgColor} ${platformInfo.color} flex items-center justify-center animate-in zoom-in duration-300`}>
                <div className="scale-75">
                  {platformInfo.icon}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between px-1">
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">We auto-detect platform & DM deep links.</p>
             {detected && <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tight">Detected: {detected.platform}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context / Outreach Strategy</label>
          <textarea 
            rows={4}
            placeholder="What's the hook? Mention recent news, shared interests..."
            className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all text-slate-900 dark:text-white font-medium resize-none"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-xl hover:opacity-95 transition-all active:scale-95 shadow-2xl shadow-slate-200 dark:shadow-none flex items-center justify-center gap-4 group"
          >
            Add to Pipeline
            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadEntry;
