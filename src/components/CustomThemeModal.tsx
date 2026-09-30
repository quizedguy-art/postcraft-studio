import React, { useState } from 'react';
import type { ThemeConfig } from '../types';
import { Palette, Check, X, Lock } from 'lucide-react';

interface CustomThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomTheme: (theme: ThemeConfig) => void;
  isPro: boolean;
  onOpenPricing: () => void;
}

export const CustomThemeModal: React.FC<CustomThemeModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomTheme,
  isPro,
  onOpenPricing,
}) => {
  const [bgGradient, setBgGradient] = useState('bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900');
  const cardBg = 'bg-slate-900/80';
  const headlineColor = 'text-white';
  const textColor = 'text-slate-300';
  const [accentColor, setAccentColor] = useState('text-indigo-400');
  const [accentBg, setAccentBg] = useState('bg-indigo-600');

  if (!isOpen) return null;

  const bgOptions = [
    { label: 'Deep Indigo', class: 'bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900' },
    { label: 'Obsidian Velvet', class: 'bg-gradient-to-br from-slate-950 via-zinc-950 to-neutral-900' },
    { label: 'Royal Purple', class: 'bg-gradient-to-br from-purple-950 via-slate-950 to-slate-900' },
    { label: 'Cyber Emerald', class: 'bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900' },
    { label: 'Warm Crimson', class: 'bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900' },
    { label: 'Pure Chalk Light', class: 'bg-gradient-to-br from-slate-100 via-white to-slate-200' },
  ];

  const accentOptions = [
    { label: 'Indigo', text: 'text-indigo-400', bg: 'bg-indigo-600' },
    { label: 'Amber Gold', text: 'text-amber-400', bg: 'bg-amber-500' },
    { label: 'Neon Emerald', text: 'text-emerald-400', bg: 'bg-emerald-500' },
    { label: 'Fuchsia Pink', text: 'text-fuchsia-400', bg: 'bg-fuchsia-600' },
    { label: 'Sky Cyan', text: 'text-sky-400', bg: 'bg-sky-500' },
    { label: 'Vibrant Orange', text: 'text-orange-400', bg: 'bg-orange-500' },
  ];

  const handleApply = () => {
    const customConfig: ThemeConfig = {
      id: 'custom',
      name: 'Custom Brand Palette',
      previewClass: 'from-indigo-600 to-purple-600',
      bgGradient,
      cardBg,
      borderColor: 'border-white/10',
      textColor,
      headlineColor,
      accentColor,
      accentBg,
      tagBg: `${accentBg}/20`,
      tagText: accentColor,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      isPro: true,
    };
    onSaveCustomTheme(customConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Custom Palette Builder
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Pro Feature
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Design custom gradient and color styles matching your brand guidelines.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BACKGROUND GRADIENTS */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Background Canvas Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {bgOptions.map(bg => {
              const isSelected = bgGradient === bg.class;
              return (
                <button
                  key={bg.label}
                  onClick={() => setBgGradient(bg.class)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${bg.class} ${
                    isSelected ? 'ring-2 ring-indigo-500 border-white font-bold' : 'border-slate-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate text-slate-200">{bg.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACCENT COLORS */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Brand Accent Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            {accentOptions.map(acc => {
              const isSelected = accentColor === acc.text;
              return (
                <button
                  key={acc.label}
                  onClick={() => {
                    setAccentColor(acc.text);
                    setAccentBg(acc.bg);
                  }}
                  className={`p-2.5 rounded-xl bg-slate-950 border text-xs flex items-center justify-between transition-all ${
                    isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full ${acc.bg}`} />
                    <span className="text-slate-200">{acc.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          {isPro ? (
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Apply Custom Theme
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Custom Palettes (Pro)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
