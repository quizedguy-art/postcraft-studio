import React, { useState } from 'react';
import type { UserSubscription } from '../types';
import { PAYMENT_CONFIG } from '../config/payments';
import { triggerConfetti } from '../utils/exporter';
import { verifyLicenseKey } from '../utils/license';
import { 
  Check, 
  Zap, 
  ShieldCheck, 
  X, 
  Crown, 
  CreditCard, 
  Key, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { checkLicenseKeyRedeemed, claimLicenseKeyInCloud } from '../utils/supabase';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  user?: any | null;
  onOpenAuth?: () => void;
  onUpgrade: (tier: 'pro' | 'lifetime', key?: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  subscription,
  user,
  onOpenAuth,
  onUpgrade,
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleActivateLicense = async () => {
    const cleanKey = licenseKeyInput.trim();
    if (!cleanKey) {
      setVerifyStatus({ type: 'error', message: 'Please enter your license key or Order ID.' });
      return;
    }

    if (!user) {
      setVerifyStatus({ 
        type: 'error', 
        message: 'Please sign in with Google or Email first so this license can be permanently locked to your account.' 
      });
      return;
    }

    setIsVerifying(true);
    setVerifyStatus(null);

    try {
      // 1. Check if key is already claimed by another user
      const redemptionCheck = await checkLicenseKeyRedeemed(cleanKey, user.id);
      if (redemptionCheck.isRedeemed) {
        setVerifyStatus({ 
          type: 'error', 
          message: `❌ ${redemptionCheck.message || 'This license is already registered to another account.'}` 
        });
        setIsVerifying(false);
        return;
      }

      // 2. Validate format and provider
      const result = await verifyLicenseKey(cleanKey);
      if (result.valid) {
        // Claim and bind key in cloud database
        const claimResult = await claimLicenseKeyInCloud(cleanKey, user.id);
        if (!claimResult.success) {
          setVerifyStatus({ 
            type: 'error', 
            message: `❌ ${claimResult.message || 'This license is already registered to another account.'}` 
          });
          setIsVerifying(false);
          return;
        }

        onUpgrade(result.tier || 'lifetime', cleanKey);
        triggerConfetti();
        setVerifyStatus({ type: 'success', message: `✅ ${result.message}` });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setVerifyStatus({ type: 'error', message: `❌ ${result.message}` });
      }
    } catch {
      setVerifyStatus({ type: 'error', message: '❌ Verification failed. Please check your internet connection.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const monthlyUrl = PAYMENT_CONFIG.monthlyPro.checkoutUrl;
  const lifetimeUrl = PAYMENT_CONFIG.lifetimeFounder.checkoutUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="text-center space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-amber-400" /> Unlock High-Yield Digital Creator Power
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Level Up to SlideForge Pro
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Create limitless viral carousels, remove watermarks, access premium aesthetics & 4K exports.
          </p>

          {subscription.isPro && (
            <div className="pt-2 flex items-center justify-center">
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                ⭐ You are currently on {subscription.tier.toUpperCase()} Pro
              </span>
            </div>
          )}
        </div>

        {/* PRICING TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* MONTHLY PRO */}
          <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Monthly Pro</h3>
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
                  Subscription
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$4.99</span>
                <span className="text-xs text-slate-400 font-medium">/ month (₹399)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Cancel anytime with 1-click.</p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Unlimited High-DPI PDF & PNG Exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Remove SlideForge Watermark</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>All 8+ Modern Pro Aesthetics & Themes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom Brand Kit & Verified Badge</span>
                </div>
              </div>
            </div>

            <a
              href={monthlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer text-center no-underline"
            >
              <span>Pay & Start $4.99/mo Pro (₹399)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          {/* LIFETIME FOUNDER PASS */}
          <div className="relative p-6 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 border-2 border-indigo-500/60 rounded-2xl flex flex-col justify-between space-y-5 shadow-xl shadow-indigo-500/10">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Most Popular • Founder Deal
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Founder Lifetime
                </h3>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">$29</span>
                <span className="text-xs text-slate-400 line-through">$99</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ₹1,999 One-Time
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Zero monthly recurring charges.</p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">Everything in Pro for Lifetime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Unlimited AI Generations & Thread Importers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Commercial Resale & Agency Rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Priority Roadmap Access & Updates</span>
                </div>
              </div>
            </div>

            <a
              href={lifetimeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer text-center no-underline"
            >
              <span>Pay & Get Lifetime Access ($29 / ₹1,999)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* LICENSE KEY ACTIVATION FORM */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" /> Have your License Key or Gumroad Order ID?
            </span>
            <span className="text-[11px] text-slate-500">From your purchase email</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={licenseKeyInput}
              onChange={e => setLicenseKeyInput(e.target.value)}
              placeholder="Paste License Key or Order ID (e.g. QxMTTY...)"
              disabled={isVerifying}
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              onClick={handleActivateLicense}
              disabled={isVerifying}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              {isVerifying && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{isVerifying ? 'Verifying...' : 'Activate License'}</span>
            </button>
          </div>
          {verifyStatus && (
            <p className={`text-xs font-medium pt-1 animate-fadeIn ${
              verifyStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {verifyStatus.message}
            </p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 14-Day Money-Back Guarantee
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-sky-400" /> Secure 256-bit Encrypted Checkout
          </span>
        </div>
      </div>
    </div>
  );
};
