
import React, { useState } from 'react';
import { MessageTemplate, SocialPlatform } from '../types';

interface TemplateManagerProps {
  templates: MessageTemplate[];
  onSave: (templates: MessageTemplate[]) => void;
  onClose: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ templates, onSave, onClose }) => {
  const [editingTemplate, setEditingTemplate] = useState<Partial<MessageTemplate> | null>(null);

  const handleAdd = () => {
    setEditingTemplate({ title: '', body: '', platform: 'Generic' });
  };

  const handleSaveEdit = () => {
    if (!editingTemplate?.title || !editingTemplate?.body) return;

    let newTemplates: MessageTemplate[];
    if (editingTemplate.id) {
      newTemplates = templates.map(t => t.id === editingTemplate.id ? (editingTemplate as MessageTemplate) : t);
    } else {
      newTemplates = [...templates, { ...editingTemplate, id: Math.random().toString(36).substr(2, 9) } as MessageTemplate];
    }

    onSave(newTemplates);
    setEditingTemplate(null);
  };

  const handleDelete = (id: string) => {
    onSave(templates.filter(t => t.id !== id));
  };

  const platforms: SocialPlatform[] = ['LinkedIn', 'Instagram', 'Email', 'WhatsApp', 'Facebook', 'Twitter', 'Generic'];

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 card-shadow border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Message Rituals</h2>
          <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest opacity-70">Standardize your outreach voice.</p>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {editingTemplate ? (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Title</label>
            <input 
              type="text" 
              placeholder="e.g. Value Offer"
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white font-medium"
              value={editingTemplate.title}
              onChange={e => setEditingTemplate({...editingTemplate, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Platform</label>
            <select 
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white font-medium appearance-none"
              value={editingTemplate.platform}
              onChange={e => setEditingTemplate({...editingTemplate, platform: e.target.value as SocialPlatform})}
            >
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Body</label>
            <textarea 
              rows={5}
              placeholder="Use {{name}}, {{company}}, {{role}} as variables..."
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white resize-none font-medium"
              value={editingTemplate.body}
              onChange={e => setEditingTemplate({...editingTemplate, body: e.target.value})}
            />
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handleSaveEdit}
              className="flex-grow py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:opacity-90 transition-all active:scale-95"
            >
              Save Ritual
            </button>
            <button 
              onClick={() => setEditingTemplate(null)}
              className="px-6 py-5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl font-bold hover:text-slate-600 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {templates.map(t => (
              <div key={t.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-slate-300 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 dark:text-white text-base">{t.title}</h3>
                    <span className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-[9px] font-black uppercase tracking-widest rounded text-slate-600 dark:text-slate-300">
                      {t.platform || 'Generic'}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingTemplate(t)} className="p-2 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">"{t.body}"</p>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No Rituals Saved</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleAdd}
            className="w-full py-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create Outreach Ritual
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
