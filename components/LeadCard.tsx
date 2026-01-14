
import React, { useState } from 'react';
import { Lead, PipelineStage, LeadHistoryEvent, MessageTemplate } from '../types';
import { PLATFORMS } from '../constants';
import { addDays, getTodayDate } from '../utils';

interface LeadCardProps {
  lead: Lead;
  templates: MessageTemplate[];
  onAction: (leadId: string, updates: Partial<Lead>, eventType: string) => void;
  onNext: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, templates, onAction, onNext }) => {
  const [showFollowUpOptions, setShowFollowUpOptions] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const platformConfig = PLATFORMS[lead.platform] || PLATFORMS.Generic;

  const handleStatusChange = (newStatus: PipelineStage, eventType: string) => {
    onAction(lead.id, { status: newStatus, nextActionDate: null }, eventType);
  };

  const handleScheduleFollowUp = (days: number) => {
    const nextDate = addDays(getTodayDate(), days);
    onAction(
      lead.id, 
      { status: PipelineStage.MESSAGE_SENT, nextActionDate: nextDate },
      `Follow-up scheduled for ${nextDate}`
    );
    setShowFollowUpOptions(false);
  };

  const parseTemplate = (body: string) => {
    return body
      .replace(/\{\{name\}\}/g, lead.name)
      .replace(/\{\{company\}\}/g, lead.company || 'your company')
      .replace(/\{\{role\}\}/g, lead.role || 'lead');
  };

  const handleSelectTemplate = (template: MessageTemplate) => {
    const message = parseTemplate(template.body);
    navigator.clipboard.writeText(message).then(() => {
      setCopySuccess(template.id);
      setTimeout(() => setCopySuccess(null), 2000);
      
      // Auto-open the DM URL if the user hasn't clicked it yet
      window.open(lead.directMessageUrl, '_blank');
      
      handleStatusChange(PipelineStage.MESSAGE_SENT, `Sent: ${template.title}`);
      setShowTemplatePicker(false);
    });
  };

  const handleMarkSentNoTemplate = () => {
    handleStatusChange(PipelineStage.MESSAGE_SENT, 'Message Sent');
    setShowTemplatePicker(false);
    window.open(lead.directMessageUrl, '_blank');
  };

  // Filter templates: show matching platform first, then generic
  const filteredTemplates = [
    ...templates.filter(t => t.platform === lead.platform),
    ...templates.filter(t => t.platform === 'Generic' || !t.platform),
    ...templates.filter(t => t.platform && t.platform !== lead.platform && t.platform !== 'Generic')
  ].filter((t, i, self) => self.findIndex(s => s.id === t.id) === i);

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-[3rem] p-10 card-shadow border border-slate-100 dark:border-slate-800 transition-all duration-500 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent opacity-50" />
      
      <div className="flex flex-col items-center text-center mb-8">
        <a 
          href={lead.directMessageUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`group/platform relative w-24 h-24 rounded-[2.5rem] ${platformConfig.bgColor} ${platformConfig.color} flex items-center justify-center mb-6 transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-slate-100 dark:shadow-none border border-transparent hover:border-slate-200 dark:hover:border-slate-700`}
        >
          {platformConfig.icon}
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-700 group-hover/platform:rotate-12 transition-transform">
             <svg className="w-5 h-5 text-slate-400 group-hover/platform:text-slate-900 dark:group-hover/platform:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
             </svg>
          </div>
        </a>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{lead.name}</h2>
        <p className="text-slate-400 text-sm font-black mt-1 uppercase tracking-[0.2em] opacity-80">
          {lead.role || 'Prospect'} <span className="text-slate-200 dark:text-slate-800 mx-1">•</span> {lead.company || 'Direct'}
        </p>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
           <span className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest">
             {lead.status}
           </span>
           {lead.nextActionDate && (
              <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/30">
                Action: {lead.nextActionDate}
              </span>
           )}
        </div>

        <button onClick={() => setShowNotes(!showNotes)} className="w-full text-left p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Context & History</span>
            <span className={`text-slate-400 transition-transform duration-300 ${showNotes ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-medium line-clamp-2 leading-relaxed">{lead.notes || "No context provided. Focus on creating value."}</p>
          {showNotes && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300 space-y-3">
               <div className="space-y-2">
                 {lead.history.slice(-3).reverse().map((evt: LeadHistoryEvent) => (
                   <div key={evt.id} className="text-[10px] text-slate-500 flex justify-between font-bold uppercase tracking-tight">
                     <span className="text-slate-800 dark:text-slate-200">{evt.type}</span>
                     <span className="opacity-40">{new Date(evt.timestamp).toLocaleDateString()}</span>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </button>
      </div>

      <div className="space-y-4 relative">
        {showTemplatePicker ? (
          <div className="space-y-4 p-6 bg-slate-900 dark:bg-slate-50 rounded-[2.5rem] border border-slate-800 dark:border-slate-200 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Pick Ritual Message</p>
              <button onClick={() => setShowTemplatePicker(false)} className="text-slate-500 hover:text-white dark:hover:text-slate-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTemplates.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => handleSelectTemplate(t)} 
                  className="w-full text-left p-4 bg-slate-800 dark:bg-white border border-slate-700 dark:border-slate-100 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group/tpl active:scale-95"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-black text-white dark:text-slate-900 group-hover/tpl:text-indigo-400">{t.title}</p>
                    {t.platform === lead.platform && (
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">Matches Platform</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed italic">"{parseTemplate(t.body)}"</p>
                </button>
              ))}
              {filteredTemplates.length === 0 && (
                <p className="text-center text-[10px] font-bold text-slate-600 py-8">No rituals saved yet.</p>
              )}
              <button 
                onClick={handleMarkSentNoTemplate} 
                className="w-full py-3 text-[10px] font-black text-slate-500 hover:text-white dark:hover:text-slate-900 uppercase tracking-widest transition-colors"
              >
                Continue without ritual message
              </button>
            </div>
          </div>
        ) : showFollowUpOptions ? (
          <div className="space-y-5 p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30 animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Schedule Follow-Up Ritual</p>
                <button onClick={() => setShowFollowUpOptions(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="grid grid-cols-3 gap-3">
               {[1, 3, 7].map(days => (
                 <button 
                   key={days} 
                   onClick={() => handleScheduleFollowUp(days)} 
                   className="py-5 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-2xl text-base font-black border border-indigo-100 dark:border-indigo-900 shadow-sm hover:shadow-md transition-all active:scale-95"
                 >
                   +{days}d
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-500">
            <button 
              onClick={() => setShowTemplatePicker(true)} 
              className="py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-base shadow-2xl col-span-2 flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              Initiate Message
            </button>
            <button onClick={() => setShowFollowUpOptions(true)} className="py-5 bg-slate-50 dark:bg-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700 active:scale-95">Follow-Up</button>
            <button onClick={() => handleStatusChange(PipelineStage.REPLIED, 'Replied')} className="py-5 bg-amber-50 dark:bg-amber-900/10 text-amber-600 font-black text-xs uppercase tracking-widest rounded-2xl border border-amber-100 dark:border-amber-900/30 active:scale-95 transition-all">Replied</button>
            <button onClick={() => handleStatusChange(PipelineStage.QUALIFIED, 'Qualified')} className="py-5 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 font-black text-xs uppercase tracking-widest rounded-2xl border border-indigo-100 dark:border-indigo-900/30 active:scale-95 transition-all">Qualified</button>
            <button onClick={() => handleStatusChange(PipelineStage.BOOKED, 'Booked')} className="py-5 bg-purple-50 dark:bg-purple-900/10 text-purple-600 font-black text-xs uppercase tracking-widest rounded-2xl border border-purple-100 dark:border-purple-900/30 active:scale-95 transition-all">Booked</button>
            <button onClick={() => handleStatusChange(PipelineStage.WON, 'Won')} className="py-5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 font-black text-xs uppercase tracking-widest rounded-2xl border border-emerald-100 dark:border-emerald-900/30 active:scale-95 transition-all">Closed Won</button>
            <button onClick={() => handleStatusChange(PipelineStage.LOST, 'Lost')} className="py-5 bg-rose-50 dark:bg-rose-900/10 text-rose-500 font-black text-xs uppercase tracking-widest rounded-2xl border border-rose-100 dark:border-rose-900/30 active:scale-95 transition-all">Closed Lost</button>
          </div>
        )}
        
        {!showTemplatePicker && (
          <button onClick={onNext} className="w-full py-5 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] transition-colors mt-2 active:scale-95">
            Skip for Now
          </button>
        )}
      </div>
      
      {copySuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          RITUAL COPIED • DM OPENING
        </div>
      )}
    </div>
  );
};

export default LeadCard;
