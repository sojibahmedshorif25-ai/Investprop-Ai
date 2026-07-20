import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-accent-600';
  if (score >= 30) return 'text-primary-600';
  return 'text-neutral-500';
}

export function getScoreBgColor(score: number): string {
  if (score >= 70) return 'bg-accent-600';
  if (score >= 30) return 'bg-primary-600';
  return 'bg-neutral-500';
}

export function getScoreGradient(score: number): string {
  if (score >= 70) return 'from-accent-500 to-accent-700';
  if (score >= 30) return 'from-primary-600 to-primary-800';
  return 'from-neutral-400 to-neutral-600';
}
