
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation of persistent user
    // Fix: Added missing templates property to satisfy User type
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      streak: 0,
      strictMode: {
        startDate: '',
        durationDays: 0,
        dailyTarget: 0,
        isConfigured: false
      },
      templates: []
    };
    onLogin(user);
  };

  const handleGoogleAuth = () => {
    // Fix: Added missing templates property to satisfy User type
    const user: User = {
      id: 'g-12345',
      email: 'user@gmail.com',
      name: 'Google User',
      streak: 0,
      strictMode: {
        startDate: '',
        durationDays: 0,
        dailyTarget: 0,
        isConfigured: false
      },
      templates: []
    };
    onLogin(user);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-3">
        <div className="inline-block p-4 bg-white dark:bg-slate-900 rounded-[2rem] card-shadow mb-4 border border-slate-100 dark:border-slate-800">
          <svg className="w-10 h-10 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">ZenLeads</h1>
        <p className="text-slate-400 font-medium">Authentication required to enter ritual.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] card-shadow border border-slate-100 dark:border-slate-800 space-y-6">
        <button 
          onClick={handleGoogleAuth}
          className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-bold text-slate-700 dark:text-slate-200">Continue with Google</span>
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">or email</span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            required
            type="email" 
            placeholder="Email Address"
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            required
            type="password" 
            placeholder="Password"
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="ml-1 text-slate-900 dark:text-white font-bold hover:underline"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
