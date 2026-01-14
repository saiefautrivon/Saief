
import { Lead, PipelineStage, SocialPlatform } from './types';

export const getTodayDate = () => new Date().toISOString().split('T')[0];

export const addDays = (date: string, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const detectPlatform = (url: string): { platform: SocialPlatform; dmUrl: string } => {
  const input = url.trim();
  const lowercaseInput = input.toLowerCase();
  
  // Email detection (regex or starts with mailto)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (lowercaseInput.startsWith('mailto:') || emailRegex.test(input)) {
    const email = lowercaseInput.startsWith('mailto:') ? input.split(':')[1] : input;
    return { 
      platform: 'Email', 
      dmUrl: `mailto:${email}` 
    };
  }

  if (lowercaseInput.includes('linkedin.com')) {
    const match = input.match(/linkedin\.com\/in\/([^/?#]+)/);
    const username = match ? match[1] : '';
    return { 
      platform: 'LinkedIn', 
      dmUrl: username ? `https://www.linkedin.com/messaging/compose/?to=${username}` : input 
    };
  }
  
  if (lowercaseInput.includes('instagram.com')) {
    const match = input.match(/instagram\.com\/([^/?#]+)/);
    const username = match ? match[1] : '';
    return { 
      platform: 'Instagram', 
      dmUrl: username ? `https://www.instagram.com/direct/t/${username}` : input 
    };
  }

  if (lowercaseInput.includes('facebook.com') || lowercaseInput.includes('messenger.com') || lowercaseInput.includes('m.me')) {
    const match = input.match(/(?:facebook\.com|messenger\.com|m\.me)\/([^/?#]+)/);
    const username = match ? match[1] : '';
    return { 
      platform: 'Facebook', 
      dmUrl: username ? `https://m.me/${username}` : input 
    };
  }

  if (lowercaseInput.includes('wa.me') || lowercaseInput.includes('whatsapp.com')) {
    const match = input.match(/(?:wa\.me|phone=)([^&/?#]+)/);
    const phone = match ? match[1].replace(/\D/g, '') : '';
    return { 
      platform: 'WhatsApp', 
      dmUrl: phone ? `https://wa.me/${phone}` : input 
    };
  }

  if (lowercaseInput.includes('twitter.com') || lowercaseInput.includes('x.com')) {
    const match = input.match(/(?:twitter\.com|x\.com)\/([^/?#]+)/);
    const username = match ? match[1] : '';
    return {
      platform: 'Twitter',
      dmUrl: username ? `https://twitter.com/messages/compose?recipient_id=${username}` : input
    };
  }

  return { platform: 'Generic', dmUrl: input };
};

export const generateLead = (data: Partial<Lead>): Lead => {
  const { platform, dmUrl } = detectPlatform(data.url || '');
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name || 'Unknown Lead',
    company: data.company || '',
    role: data.role || '',
    email: data.email || '',
    phone: data.phone || '',
    platform: platform,
    url: data.url || '',
    directMessageUrl: dmUrl,
    notes: data.notes || '',
    status: PipelineStage.NEW_LEAD,
    history: [{ id: 'init', type: 'Lead Created', timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    ...data
  } as Lead;
};

export const filterActionableLeads = (leads: Lead[]) => {
  const today = getTodayDate();
  return leads.filter(lead => {
    if (lead.status === PipelineStage.WON || lead.status === PipelineStage.LOST) return false;
    if (lead.status === PipelineStage.NEW_LEAD) return true;
    if (lead.nextActionDate && lead.nextActionDate <= today) return true;
    return false;
  });
};

export const calculateStrictModeDay = (startDate: string) => {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const today = new Date(getTodayDate());
  const diffTime = Math.abs(today.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};
