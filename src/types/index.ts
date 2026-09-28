export type AspectRatio = '4:5' | '1:1' | '16:9' | '9:16';

export type ThemeId = 
  | 'hyper-dark'
  | 'midnight-blue'
  | 'neo-brutal'
  | 'minimal-chalk'
  | 'sunset-glow'
  | 'emerald-trust'
  | 'pastel-soft'
  | 'cyberpunk';

export type SlideType = 
  | 'cover'
  | 'content'
  | 'quote'
  | 'tweet'
  | 'stats'
  | 'code'
  | 'cta';

export interface StatItem {
  value: string;
  label: string;
  subtext?: string;
}

export interface Slide {
  id: string;
  type: SlideType;
  tag?: string;
  headline: string;
  subtitle?: string;
  body?: string;
  bulletPoints?: string[];
  stats?: StatItem[];
  quoteAuthor?: string;
  quoteRole?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  highlightText?: string;
  alignment?: 'left' | 'center';
  customBg?: string;
}

export interface BrandKit {
  name: string;
  handle: string;
  avatar: string;
  website: string;
  logoUrl?: string;
  isVerified?: boolean;
}

export interface Project {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  themeId: ThemeId;
  brand: BrandKit;
  slides: Slide[];
  customFont: string;
  showWatermark: boolean;
  showSlideNumbers: boolean;
  showSwipeIndicator: boolean;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  previewClass: string;
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  headlineColor: string;
  accentColor: string;
  accentBg: string;
  tagBg: string;
  tagText: string;
  fontFamily: string;
  isPro?: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'growth' | 'tech' | 'story' | 'tips' | 'quote';
  badge: string;
  slides: Slide[];
}

export interface UserSubscription {
  isPro: boolean;
  tier: 'free' | 'pro' | 'lifetime';
  exportsToday: number;
  maxFreeExportsPerDay: number;
  licenseKey?: string;
}
