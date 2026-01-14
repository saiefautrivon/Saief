
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] dark:bg-slate-950 overflow-y-auto">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcfcfd]/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">ZenLeads</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin} 
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl"
            >
              Login
            </button>
            <button 
              onClick={onGetStarted} 
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
            >
              Join Ritual
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Focused Outreach Ritual
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
            Stop Working.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500">Start Connecting.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            spreadsheet fatigue is the #1 killer of sales momentum. ZenLeads treats outreach like a card ritual—one prospect, one focus, zero burnout.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={onGetStarted}
              className="px-16 py-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-2xl hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-indigo-200 dark:shadow-none"
            >
              Get Started Now
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 pt-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">LinkedIn Friendly</div>
             <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">Instagram Optimized</div>
             <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">Facebook Ready</div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">Why Ritual Matters.</h2>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Zero Decision Fatigue</h4>
                    <p className="text-slate-500 dark:text-slate-400">We don't give you a list. We give you a card. Act on it or skip it. Move on.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">The "Strict Mode" Pact</h4>
                    <p className="text-slate-500 dark:text-slate-400">Set a target. Don't break it. Build a streak that feels too good to lose.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Platform Agnostic</h4>
                    <p className="text-slate-500 dark:text-slate-400">Whether it's LinkedIn or WhatsApp, we open the DM for you in one click.</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] card-shadow border border-slate-100 dark:border-slate-800 rotate-2 hover:rotate-0 transition-transform duration-700">
             <div className="space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 font-black text-2xl">L</div>
                   <div>
                     <div className="text-2xl font-black">Jane Cooper</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product Lead | Stripe</div>
                   </div>
                </div>
                <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full" />
                <div className="grid grid-cols-2 gap-4">
                   <div className="h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm">Message Sent</div>
                   <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-sm">Follow Up</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 text-center">
         <div className="max-w-2xl mx-auto space-y-8">
           <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Ready to enter flow state?</h3>
           <button 
             onClick={onGetStarted}
             className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
           >
             Join the 2,400+ Ritual Members
           </button>
         </div>
      </section>

      <footer className="py-12 border-t border-slate-100 dark:border-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 font-bold text-[10px] uppercase tracking-[0.3em]">
          <span>© 2024 Ritual Systems</span>
          <div className="flex gap-8">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Zen Mode</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
