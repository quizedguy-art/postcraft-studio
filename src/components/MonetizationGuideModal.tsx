import React from 'react';
import { DollarSign, Rocket, Target, X, Sparkles } from 'lucide-react';

interface MonetizationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonetizationGuideModal: React.FC<MonetizationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                $100/Week Monetization Playbook
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Target: $400 - $500/Mo
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                The exact blueprint to turn this application into a consistent weekly income stream.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* REVENUE FORMULA */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" /> The Math to $100 / Week
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">$100/wk = $430/mo</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Path A: Recurring Subscriptions
              </div>
              <p className="text-slate-400">
                <strong className="text-slate-200">50 active subscribers</strong> @ $5.99/month (₹499/mo) = <span className="text-emerald-400 font-bold">~$300/month recurring</span>.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Path B: Lifetime Founder Passes
              </div>
              <p className="text-slate-400">
                <strong className="text-slate-200">3–4 one-time sales/week</strong> @ $29 = <span className="text-emerald-400 font-bold">$87–$116 every single week</span>.
              </p>
            </div>
          </div>
        </div>

        {/* 4-STEP ACTION ROADMAP */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-indigo-400" /> 4-Step Launch & Acquisition Plan
          </h3>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px]">01</span>
                  Deploy to Vercel / Netlify (Free Hosting)
                </span>
                <span className="text-emerald-400 text-[11px] font-mono">Cost: $0.00</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Connect this repository to Vercel or Netlify. Run <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">npm run build</code>. Your production URL goes live in 60 seconds with 100% free hosting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px]">02</span>
                  Hook Up Stripe or Lemon Squeezy Checkout
                </span>
                <span className="text-indigo-400 text-[11px] font-mono">5 Min Setup</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Create a payment link on <strong>Lemon Squeezy</strong> or <strong>Stripe Payment Links</strong> ($5.99/mo [₹499] recurring + $29 lifetime). Update the checkout button in <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">PricingModal.tsx</code>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px]">03</span>
                  The Built-in Organic Viral Loop
                </span>
                <span className="text-amber-400 text-[11px] font-mono">Zero Ad Spend</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Every free export has a small <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">⚡ SlideForge.io</code> footer. When creators post their carousels on LinkedIn & Twitter, their audiences click the link to create their own carousels, generating a compounding traffic loop.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px]">04</span>
                  Where to Get Your First 10 Paying Customers
                </span>
                <span className="text-emerald-400 text-[11px] font-mono">High Conversion</span>
              </div>
              <ul className="list-disc list-inside text-slate-400 space-y-1 pt-1">
                <li><strong>Reddit</strong>: Post on <code className="text-slate-300">r/SideProject</code>, <code className="text-slate-300">r/SaaS</code>, <code className="text-slate-300">r/Entrepreneur</code> ("I built a free tool to generate viral carousels in 10 seconds").</li>
                <li><strong>Product Hunt & Indie Hackers</strong>: Launch for immediate initial spike of 500-1500 creator visits.</li>
                <li><strong>Twitter & LinkedIn Build In Public</strong>: Share carousels made with the tool breakdown of founder metrics.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cold Outreach Script Template */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Converting DM Template (for LinkedIn/X Creators)
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 leading-relaxed border border-slate-800 select-all">
            "Hey [Name], loved your recent post on [Topic]! I turned your key insights into a high-res visual carousel slide deck using my tool SlideForge. Feel free to repost it! Here is the PDF preview: [Link]. If you ever want to generate your own in 10 seconds, check out [YourAppUrl]!"
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
          >
            Got It, Let's Launch! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
