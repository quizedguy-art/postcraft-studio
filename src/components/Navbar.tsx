import React, { useState } from 'react';
import type { AspectRatio, ThemeId, UserSubscription } from '../types';
import { 
  Sparkles, 
  Download, 
  Layers, 
  User, 
  Crown, 
  DollarSign, 
  ChevronDown, 
  FileText, 
  FolderArchive, 
  Image as ImageIcon,
} from 'lucide-react';

interface NavbarProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  selectedThemeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
  subscription: UserSubscription;
  onOpenAI: () => void;
  onOpenTemplates: () => void;
  onOpenBrandKit: () => void;
  onOpenPricing: () => void;
  onOpenGuide: () => void;
  onExportPdf: () => void;
  onExportZip: () => void;
  onExportPng: () => void;
  isExporting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  aspectRatio,
  onAspectRatioChange,
  subscription,
  onOpenAI,
  onOpenTemplates,
  onOpenBrandKit,
  onOpenPricing,
  onOpenGuide,
  onExportPdf,
  onExportZip,
  onExportPng,
  isExporting,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const ratios: { id: AspectRatio; label: string; sub: string }[] = [
    { id: '4:5', label: '4:5', sub: 'LinkedIn / IG' },
    { id: '1:1', label: '1:1', sub: 'Square' },
    { id: '16:9', label: '16:9', sub: 'Twitter / X' },
    { id: '9:16', label: '9:16', sub: 'Story / Reel' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* LOGO & TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg text-white tracking-tight">
                Slide<span className="text-indigo-400">Forge</span>
              </span>
              <button
                onClick={onOpenPricing}
                title="Manage Subscription"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                {subscription.isPro ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-mono flex items-center gap-1 shadow-sm">
                    <Crown className="w-3 h-3 fill-white" /> PRO
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    FREE TIER
                  </span>
                )}
              </button>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400">
              AI Viral Carousel & Visual Deck Studio
            </p>
          </div>
        </div>

        {/* MIDDLE CONTROLS: RATIO */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          {ratios.map(r => (
            <button
              key={r.id}
              onClick={() => onAspectRatioChange(r.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                aspectRatio === r.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{r.label}</span>
              <span className="text-[10px] opacity-70 ml-1">({r.sub.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* ACTION BUTTONS & EXPORT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* $100/Wk Monetization Guide */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm shadow-emerald-500/10"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span className="hidden md:inline">$100/Wk Guide</span>
          </button>

          {/* AI Magic Generator */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>

          {/* Templates */}
          <button
            onClick={onOpenTemplates}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Templates</span>
          </button>

          {/* Brand Kit */}
          <button
            onClick={onOpenBrandKit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Brand Kit</span>
          </button>

          {/* Upgrade CTA / Pricing */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subscription.isPro
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 animate-pulse'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{subscription.isPro ? 'Pro Active' : 'Upgrade'}</span>
          </button>


          {/* EXPORT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all shadow-lg disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showExportMenu && (
              <div
                onMouseLeave={() => setShowExportMenu(false)}
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50 text-xs animate-fadeIn"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Select Format
                </div>

                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportPdf();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="font-bold text-white">Multi-Page PDF</div>
                      <div className="text-[10px] text-slate-400">Best for LinkedIn Document</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono">PDF</span>
                </button>

                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportZip();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FolderArchive className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-bold text-white">High-Res PNG ZIP</div>
                      <div className="text-[10px] text-slate-400">Best for Instagram & Twitter</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono">ZIP</span>
                </button>

                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportPng();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-400" />
                    <div>
                      <div className="font-bold text-white">Current Slide PNG</div>
                      <div className="text-[10px] text-slate-400">Single image snapshot</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono">PNG</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
