import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
}

export interface StatItem {
  id: number;
  label: string;
  value: string;
  suffix?: string;
  icon: ReactNode;
}

export interface QuickLinkItem {
  title: string;
  description: string;
  icon: ReactNode;
  linkText: string;
  linkHref: string;
  colorClass: string; // Tailwind class for icon color or background
}