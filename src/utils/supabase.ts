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
 * Sign in with Email & Password
 */
export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    return { error: { message: 'Supabase is not configured.' } };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign up with Email & Password
 */
export async function signUpWithPassword(email: string, password: string) {
  if (!supabase) {
    return { error: { message: 'Supabase is not configured.' } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
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
 * Delete Project from Cloud Database
 */
export async function deleteProjectFromCloud(projectId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project from cloud:', error);
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

/**
 * Save User Subscription to Cloud Profile
 */
export async function saveUserSubscriptionToCloud(userId: string, subscription: UserSubscription) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      is_pro: subscription.isPro,
      subscription_tier: subscription.tier,
      license_key: subscription.licenseKey || null,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error saving subscription to cloud:', error);
  }
  return data;
}

/**
 * Check if a license key or order ID is already redeemed by another user account
 */
export async function checkLicenseKeyRedeemed(licenseKey: string, currentUserId?: string): Promise<{ isRedeemed: boolean; message?: string }> {
  if (!supabase) return { isRedeemed: false };

  const cleanKey = licenseKey.trim();
  if (!cleanKey) return { isRedeemed: false };

  try {
    // 1. Check redeemed_licenses table (publicly queryable to detect claimed keys)
    const { data: licenseRecord, error: lErr } = await supabase
      .from('redeemed_licenses')
      .select('user_id')
      .eq('license_key', cleanKey)
      .maybeSingle();

    if (!lErr && licenseRecord) {
      if (licenseRecord.user_id !== currentUserId) {
        return {
          isRedeemed: true,
          message: 'This license key / order ID is already bound to another account. Each purchase is strictly for 1 account.',
        };
      }
    }
  } catch (err) {
    console.error('Error checking license redemption:', err);
  }

  return { isRedeemed: false };
}

/**
 * Claim and lock a license key to a user account
 */
export async function claimLicenseKeyInCloud(licenseKey: string, userId: string): Promise<{ success: boolean; message?: string }> {
  if (!supabase) return { success: true };

  const cleanKey = licenseKey.trim();
  try {
    // Insert into redeemed_licenses
    const { error: insErr } = await supabase
      .from('redeemed_licenses')
      .insert({
        license_key: cleanKey,
        user_id: userId,
      });

    if (insErr) {
      // If error code is 23505 (unique_violation), it means another account already claimed it!
      if (insErr.code === '23505' || insErr.message?.includes('duplicate key')) {
        return {
          success: false,
          message: 'This license key / order ID has already been redeemed by another account.',
        };
      }
    }

    // Update user profile to Pro
    await saveUserSubscriptionToCloud(userId, {
      isPro: true,
      tier: 'lifetime',
      licenseKey: cleanKey,
      exportsToday: 0,
      maxFreeExportsPerDay: 5,
    });

    return { success: true };
  } catch (e: any) {
    console.error('Error claiming license in cloud:', e);
    return { success: false, message: e.message || 'Could not claim license.' };
  }
}


