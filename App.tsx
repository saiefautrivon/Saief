
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Lead, ViewMode, PipelineStage, User, StrictModeSettings, MessageTemplate } from './types';
import { filterActionableLeads, getTodayDate, calculateStrictModeDay } from './utils';
import LeadCard from './components/LeadCard';
import LeadEntry from './components/LeadEntry';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import TemplateManager from './components/TemplateManager';
import LandingPage from './components/LandingPage';

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  { id: 't1', title: 'Value First', body: 'Hey {{name}}, loved your recent post on {{company}}. Would love to connect and share some thoughts!', platform: 'LinkedIn' },
  { id: 't2', title: 'Direct Intro', body: 'Hi {{name}}, I help {{role}}s at companies like {{company}} scale their outreach. Open to a brief chat?', platform: 'Generic' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zenleads_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('zenleads_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (!user) return 'LANDING';
    if (!user.strictMode.isConfigured) return 'ONBOARDING';
    return 'HOME';
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (user) {
      localStorage.setItem('zenleads_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zenleads_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zenleads_leads', JSON.stringify(leads));
  }, [leads]);

  const actionableLeads = useMemo(() => filterActionableLeads(leads), [leads]);
  
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(PipelineStage).forEach(stage => {
      counts[stage] = leads.filter(l => l.status === stage).length;
    });
    return counts;
  }, [leads]);

  const sessionTarget = user?.strictMode.dailyTarget || 0;
  const currentSessionLeads = useMemo(() => {
    return actionableLeads.slice(0, sessionTarget);
  }, [actionableLeads, sessionTarget]);

  const strictModeDay = useMemo(() => {
    if (!user?.strictMode.startDate) return 0;
    return calculateStrictModeDay(user.strictMode.startDate);
  }, [user]);

  const handleLogin = (newUser: User) => {
    const enrichedUser = { 
      ...newUser, 
      templates: (newUser.templates && newUser.templates.length > 0) ? newUser.templates : DEFAULT_TEMPLATES 
    };
    setUser(enrichedUser);
    setViewMode(enrichedUser.strictMode.isConfigured ? 'HOME' : 'ONBOARDING');
  };

  const handleLogout = () => {
    setUser(null);
    setViewMode('LANDING');
  };

  const completeOnboarding = (settings: StrictModeSettings) => {
    if (user) {
      setUser({ ...user, strictMode: settings });
      setViewMode('HOME');
    }
  };

  const startSession = () => {
    if (actionableLeads.length === 0) {
      alert("No pending cards! Add some leads to start a session.");
      setViewMode('LEAD_ENTRY');
      return;
    }
    setCurrentIndex(0);
    setViewMode('SESSION_ACTIVE');
  };

  const updateLead = useCallback((leadId: string, updates: Partial<Lead>, eventType: string) => {
    setLeads(prevLeads => prevLeads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          ...updates,
          history: [
            ...l.history,
            { id: Math.random().toString(36).substr(2, 9), type: eventType, timestamp: new Date().toISOString() }
          ]
        };
      }
      return l;
    }));

    setTimeout(() => {
      if (currentIndex < currentSessionLeads.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishSession();
      }
    }, 450);
  }, [currentIndex, currentSessionLeads.length]);

  const skipCard = () => {
    if (currentIndex < currentSessionLeads.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    setViewMode('SESSION_FINISHED');
    const today = getTodayDate();
    if (user && user.lastSessionDate !== today) {
      setUser({ ...user, streak: user.streak + 1, lastSessionDate: today });
    }
  };

  const addNewLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  const updateTemplates = (templates: MessageTemplate[]) => {
    if (user) {
      setUser({ ...user, templates });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
      </div>

      <main className="flex-grow flex flex-col relative z-10">
        {viewMode === 'LANDING' && (
          <LandingPage onGetStarted={() => setViewMode('AUTH')} onLogin={() => setViewMode('AUTH')} />
        )}

        {viewMode === 'AUTH' && (
          <div className="flex-grow flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              <button onClick={() => setViewMode('LANDING')} className="mb-8 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7" /></svg>
                Exit to Landing
              </button>
              <Auth onLogin={handleLogin} />
            </div>
          </div>
        )}

        {viewMode === 'ONBOARDING' && (
          <div className="flex-grow flex items-center justify-center p-6">
            <Onboarding onComplete={completeOnboarding} />
          </div>
        )}

        {viewMode === 'HOME' && user && (
          <div className="w-full max-w-6xl mx-auto space-y-12 py-12 px-6 animate-in fade-in duration-700">
            {/* Command Center Header */}
            <header className="flex justify-between items-end">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Command Center</h1>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Ritual Protocol Active • Day {strictModeDay} of {user.strictMode.durationDays}</p>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setViewMode('MANAGE_TEMPLATES')} className="p-4 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-all card-shadow hover:scale-105 active:scale-95" title="Message Rituals">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </button>
                <button onClick={handleLogout} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-95">Logout</button>
              </div>
            </header>

            {/* Pipeline Stage Visualization */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'New Lead', stage: PipelineStage.NEW_LEAD, color: 'text-slate-400', bg: 'bg-slate-50' },
                { label: 'Sent', stage: PipelineStage.MESSAGE_SENT, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Replied', stage: PipelineStage.REPLIED, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Qualified', stage: PipelineStage.QUALIFIED, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { label: 'Booked', stage: PipelineStage.BOOKED, color: 'text-purple-500', bg: 'bg-purple-50' },
                { label: 'Won', stage: PipelineStage.WON, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Lost', stage: PipelineStage.LOST, color: 'text-rose-400', bg: 'bg-rose-50' },
              ].map((item) => (
                <div key={item.stage} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 card-shadow flex flex-col items-center text-center space-y-2 transition-all hover:translate-y-[-2px]">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-70 leading-none">{item.label}</span>
                   <span className={`text-4xl font-black ${item.color}`}>{stageCounts[item.stage] || 0}</span>
                   <div className={`h-1 w-8 rounded-full ${item.bg} opacity-50`} />
                </div>
              ))}
            </div>

            {/* Main Action Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Daily Ritual CTA */}
               <div className="lg:col-span-2 bg-slate-900 dark:bg-white rounded-[3.5rem] p-16 text-center flex flex-col items-center justify-center space-y-10 shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:shadow-indigo-200 duration-500">
                  <div className="space-y-6">
                    <h2 className="text-6xl font-black text-white dark:text-slate-900 tracking-tighter leading-none">Your ritual is ready.</h2>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-xl uppercase tracking-widest opacity-80">Target: {user.strictMode.dailyTarget} cards today</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                    <button onClick={startSession} className="px-16 py-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                      Enter Ritual
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                    </button>
                    <button onClick={() => setViewMode('LEAD_ENTRY')} className="px-12 py-8 border-2 border-slate-700 dark:border-slate-200 text-white dark:text-slate-900 rounded-[2rem] font-black text-xl hover:bg-slate-800 dark:hover:bg-slate-50 transition-all active:scale-95">
                      + Add Prospect
                    </button>
                  </div>
               </div>

               {/* Consistency Stats */}
               <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-slate-800 card-shadow space-y-10">
                  <div className="text-center space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Consistency</div>
                    <div className="text-7xl font-black text-emerald-500 tracking-tighter">{user.streak}d</div>
                    <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest opacity-40">Ritual Streak</div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                      <span>Pipeline Flow</span>
                      <span className="text-slate-900 dark:text-white">{Math.round((stageCounts[PipelineStage.WON] / (leads.length || 1)) * 100)}% Conversion</span>
                    </div>
                    <div className="h-4 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                       <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-sm" 
                        style={{ width: `${(stageCounts[PipelineStage.WON] / (leads.length || 1)) * 100}%` }}
                       />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4">
                     <div className="text-center space-y-1">
                        <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{leads.length}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</div>
                     </div>
                     <div className="text-center space-y-1 border-x border-slate-100 dark:border-slate-800 px-4">
                        <div className="text-2xl font-black text-indigo-500 leading-none">{actionableLeads.length}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pending</div>
                     </div>
                     <div className="text-center space-y-1">
                        <div className="text-2xl font-black text-emerald-500 leading-none">{stageCounts[PipelineStage.WON]}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Closed</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* List View Overview */}
            <div className="space-y-8">
               <div className="flex justify-between items-center px-4">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Actionable Lead Queue</h3>
                 <button onClick={() => setViewMode('LEAD_ENTRY')} className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest transition-colors">Manage Full Pipeline</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {actionableLeads.length > 0 ? (
                   actionableLeads.slice(0, 6).map(lead => (
                    <div key={lead.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 card-shadow flex items-center gap-5 transition-all hover:translate-y-[-4px] hover:shadow-xl group active:scale-95 cursor-pointer">
                       <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-500 transition-all duration-300">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                       </div>
                       <div className="flex-grow min-w-0">
                          <h4 className="font-black text-slate-900 dark:text-white truncate text-lg tracking-tight leading-none mb-1">{lead.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate opacity-70">{lead.company || 'Direct Contact'}</p>
                       </div>
                       <div className="text-[9px] font-black text-indigo-500 uppercase whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{lead.status.split(' ')[0]}</div>
                    </div>
                   ))
                 ) : (
                  <div className="col-span-full py-24 text-center space-y-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800">
                     <span className="text-6xl grayscale opacity-50 block">🧘</span>
                     <div className="space-y-2">
                       <p className="text-slate-900 dark:text-white font-black text-2xl tracking-tight">Ritual Pipeline Clear.</p>
                       <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No actionable cards at this moment.</p>
                     </div>
                  </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {viewMode === 'LEAD_ENTRY' && (
          <div className="flex-grow flex items-center justify-center p-6">
            <LeadEntry onAdd={addNewLead} onClose={() => setViewMode('HOME')} />
          </div>
        )}

        {viewMode === 'MANAGE_TEMPLATES' && user && (
          <div className="flex-grow flex items-center justify-center p-6">
            <TemplateManager templates={user.templates} onSave={updateTemplates} onClose={() => setViewMode('HOME')} />
          </div>
        )}

        {viewMode === 'SESSION_ACTIVE' && currentSessionLeads.length > 0 && (
          <div className="w-full max-w-2xl mx-auto space-y-12 py-20 px-6">
            <div className="flex justify-between items-center px-10">
              <div className="flex items-center gap-6">
                 <div className="h-2 w-56 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 dark:bg-white transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      style={{ width: `${((currentIndex + 1) / currentSessionLeads.length) * 100}%` }}
                    />
                 </div>
                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{currentIndex + 1} / {currentSessionLeads.length}</span>
              </div>
              <button onClick={() => setViewMode('HOME')} className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-[0.3em] transition-colors">Abort Ritual</button>
            </div>
            <div key={currentSessionLeads[currentIndex].id} className="animate-in fade-in slide-in-from-right-16 duration-700 ease-out">
              <LeadCard lead={currentSessionLeads[currentIndex]} templates={user?.templates || []} onAction={updateLead} onNext={skipCard} />
            </div>
          </div>
        )}

        {viewMode === 'SESSION_FINISHED' && user && (
          <div className="flex-grow flex items-center justify-center p-6">
            <div className="w-full max-w-xl text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
              <div className="space-y-8">
                <div className="w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner ring-8 ring-emerald-500/5 animate-bounce-slow">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Ritual Complete.</h2>
                <p className="text-slate-400 text-2xl leading-relaxed px-12 font-medium">The standard was met. Rest well. Your streak is now <span className="text-emerald-500 font-black">{user.streak} days</span>.</p>
              </div>
              <button onClick={() => setViewMode('HOME')} className="w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] font-black text-2xl shadow-2xl hover:opacity-90 transition-all active:scale-95">Return to Command Center</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
