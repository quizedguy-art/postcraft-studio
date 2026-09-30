export type AspectRatio = '4:5' | '1:1' | '16:9' | '9:16';

export type ThemeId = 
  | 'hyper-dark'
  | 'midnight-blue'
  | 'neo-brutal'
  | 'minimal-chalk'
  | 'sunset-glow'
  | 'emerald-trust'
  | 'pastel-soft'
  | 'cyberpunk'
  | 'custom';

export type FontFamilyId = 
  | 'inter'
  | 'jakarta'
  | 'outfit'
  | 'space'
  | 'playfair'
  | 'jetbrains'
  | 'syne'
  | 'bricolage';

export interface FontOption {
  id: FontFamilyId;
  name: string;
  fontFamily: string;
  category: 'sans' | 'serif' | 'mono' | 'display';
  preview: string;
}

export type SlideType = 
  | 'cover'
  | 'content'
  | 'quote'
  | 'tweet'
  | 'stats'
  | 'code'
  | 'image'
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
  // Slide Media & Custom Visuals
  imageUrl?: string;
  imageCaption?: string;
  imagePosition?: 'top' | 'middle' | 'background';
}

export interface BrandKit {
  name: string;
  handle: string;
  avatar: string;
  website: string;
  logoUrl?: string;
  isVerified?: boolean;
}

export interface CustomThemeConfig {
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  headlineColor: string;
  accentColor: string;
  accentBg: string;
  tagBg: string;
  tagText: string;
}

export interface Project {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  themeId: ThemeId;
  customTheme?: CustomThemeConfig;
  brand: BrandKit;
  slides: Slide[];
  customFont: FontFamilyId;
  showWatermark: boolean;
  showSlideNumbers: boolean;
  showSwipeIndicator: boolean;
  updatedAt?: number;
  createdAt?: number;
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

export interface ProjectSummary {
  id: string;
  title: string;
  slideCount: number;
  aspectRatio: AspectRatio;
  themeId: ThemeId;
  updatedAt: number;
}
