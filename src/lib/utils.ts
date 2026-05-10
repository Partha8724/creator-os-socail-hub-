import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NAV_ITEMS = [
  { label: 'Smart Hub', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'VidIQ Suite', path: '/analytics', icon: 'Youtube' },
  { label: 'Meta Suite', path: '/meta', icon: 'Layers' },
  { label: 'Trend Engine', path: '/trends', icon: 'TrendingUp' },
  { label: 'Competitor Spy', path: '/competitor', icon: 'Eye' },
  { label: 'Sponsorship', path: '/sponsorship', icon: 'DollarSign' },
  { label: 'Creator Studio', path: '/studio', icon: 'Zap' },
  { label: 'Vertical Studio', path: '/vertical', icon: 'Smartphone' },
  { label: 'Omni-Queue', path: '/scheduler', icon: 'Clock' },
  { label: 'Viral Forge', path: '/forge', icon: 'Zap' },
  { label: 'Retention Lab', path: '/retention', icon: 'Activity' },
  { label: 'Neural Studio', path: '/thumbnails', icon: 'BrainCircuit' },
  { label: 'Architect UX', path: '/architect', icon: 'BarChart2' },
  { label: 'Upgrade', path: '/hub-upgrade', icon: 'CreditCard' },
];
