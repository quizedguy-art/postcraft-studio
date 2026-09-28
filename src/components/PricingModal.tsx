import React, { useState } from 'react';
import type { UserSubscription } from '../types';
import { PAYMENT_CONFIG } from '../config/payments';
import { triggerConfetti } from '../utils/exporter';
import { 
  Check, 
  Zap, 
  ShieldCheck, 
  X, 
  Crown, 
  CreditCard, 
  Key, 
  ExternalLink, 
  Settings2
} from 'lucide-react';


interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgrade: (tier: 'pro' | 'lifetime', key?: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<string | null>(null);
  const [showConfigHelper, setShowConfigHelper] = useState(false);
  const [customMonthlyLink, setCustomMonthlyLink] = useState(PAYMENT_CONFIG.monthlyPro.checkoutUrl);
  const [customLifetimeLink, setCustomLifetimeLink] = useState(PAYMENT_CONFIG.lifetimeFounder.checkoutUrl);
  const [providerChoice, setProviderChoice] = useState<'stripe' | 'lemonsqueezy' | 'demo'>(PAYMENT_CONFIG.provider);

  if (!isOpen) return null;

  const handleApplyKey = () => {
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'FOUNDER100' || clean === 'PROPASS' || clean === 'GROWTH2026' || clean === 'VIP') {
      onUpgrade('lifetime', clean);
      triggerConfetti();
      setPromoStatus('✅ Lifetime Pro License successfully activated!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setPromoStatus('❌ Invalid license code. Try "FOUNDER100" or upgrade below.');
    }
  };

  const handleInitiateCheckout = (tier: 'pro' | 'lifetime') => {
    if (providerChoice === 'demo') {
      // Demo instant activation
      onUpgrade(tier, `SIMULATED-${Date.now().toString(36).toUpperCase()}`);
      triggerConfetti();
      onClose();
      return;
    }

    const targetUrl = tier === 'lifetime' ? customLifetimeLink : customMonthlyLink;
    if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
      // Redirect to real Stripe or Lemon Squeezy payment page
      window.open(targetUrl, '_blank');
    } else {
      // Fallback
      onUpgrade(tier, `SUB-${Date.now().toString(36).toUpperCase()}`);
      triggerConfetti();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="text-center space-y-2 relative">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <button
              onClick={() => setShowConfigHelper(!showConfigHelper)}
              title="Configure Payment Links (Owner Settings)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Setup Links</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-amber-400" /> Unlock High-Yield Digital Creator Power
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Level Up to SlideForge Pro
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Create limitless viral carousels, remove watermarks, access premium aesthetics & 4K exports.
          </p>
        </div>

        {/* OWNER PAYMENT LINK CONFIGURATION DRAWER */}
        {showConfigHelper && (
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between font-bold text-indigo-200">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-400" /> Owner Payment Link Configuration
              </span>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                Live Switcher
              </span>
            </div>
            <p className="text-slate-300">
              Paste your checkout links from <strong>Stripe Payment Links</strong> or <strong>Lemon Squeezy</strong> below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Monthly Pro ($9/mo) Checkout Link:
                </label>
                <input
                  type="text"
                  value={customMonthlyLink}
                  onChange={e => setCustomMonthlyLink(e.target.value)}
                  placeholder="https://buy.stripe.com/..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Lifetime Pass ($29) Checkout Link:
                </label>
                <input
                  type="text"
                  value={customLifetimeLink}
                  onChange={e => setCustomLifetimeLink(e.target.value)}
                  placeholder="https://yourstore.lemonsqueezy.com/buy/..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={providerChoice === 'demo'}
                    onChange={() => setProviderChoice('demo')}
                    className="accent-indigo-500"
                  />
                  <span>Test Demo Mode (Instant)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={providerChoice === 'stripe'}
                    onChange={() => setProviderChoice('stripe')}
                    className="accent-indigo-500"
                  />
                  <span>Live Payment Link Mode</span>
                </label>
              </div>

              <button
                onClick={() => setShowConfigHelper(false)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}

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
                <span className="text-3xl font-black text-white">$9</span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
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

            <button
              onClick={() => handleInitiateCheckout('pro')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <span>Start $9/mo Pro</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>
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
                  Pay Once, Own Forever
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

            <button
              onClick={() => handleInitiateCheckout('lifetime')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
            >
              <span>Get Lifetime Access for $29</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>

        {/* LICENSE KEY ACTIVATION FORM */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" /> Have a license code or promo voucher?
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Demo: FOUNDER100</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              placeholder="Enter license key (e.g. FOUNDER100)..."
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleApplyKey}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Activate
            </button>
          </div>
          {promoStatus && (
            <p className="text-xs font-medium pt-1 animate-fadeIn">{promoStatus}</p>
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
