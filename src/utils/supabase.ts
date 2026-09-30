import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Project, UserSubscription } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) {
    console.warn('Supabase is not configured yet with environment variables.');
    return { error: { message: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  return { data, error };
}

/**
 * Sign in with Email / Magic Link
 */
export async function signInWithEmail(email: string) {
  if (!supabase) {
    return { error: { message: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  return { data, error };
}

/**
 * Sign Out
 */
export async function signOut() {
  if (!supabase) return { error: null };
  return await supabase.auth.signOut();
}

/**
 * Save Project to Cloud Database
 */
export async function saveProjectToCloud(userId: string, project: Project) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .upsert({
      id: project.id,
      user_id: userId,
      title: project.title,
      aspect_ratio: project.aspectRatio,
      theme_id: project.themeId,
      font_family: project.customFont,
      slides_data: project.slides,
      brand_data: project.brand,
      updated_at: new Date().toISOString(),
    })
    .select();

  if (error) {
    console.error('Error saving project to cloud:', error);
  }
  return data;
}

/**
 * Fetch All User Projects from Cloud
 */
export async function fetchUserProjectsFromCloud(userId: string): Promise<Project[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching cloud projects:', error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    aspectRatio: row.aspect_ratio || '4:5',
    themeId: row.theme_id || 'hyper-dark',
    customFont: row.font_family || 'jakarta',
    slides: row.slides_data || [],
    brand: row.brand_data,
    showWatermark: row.show_watermark ?? true,
    showSlideNumbers: true,
    showSwipeIndicator: true,
    updatedAt: new Date(row.updated_at).getTime(),
  }));
}

/**
 * Sync / Fetch User Subscription Tier from Cloud
 */
export async function fetchUserSubscription(userId: string): Promise<Partial<UserSubscription> | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('is_pro, subscription_tier, license_key')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    isPro: Boolean(data.is_pro),
    tier: data.subscription_tier || (data.is_pro ? 'lifetime' : 'free'),
    licenseKey: data.license_key,
  };
}
