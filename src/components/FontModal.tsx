import React from 'react';
import type { FontFamilyId } from '../types';
import { FONTS } from '../data/fonts';
import { Type, Check, X } from 'lucide-react';

interface FontModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFont: FontFamilyId;
  onSelectFont: (font: FontFamilyId) => void;
}

export const FontModal: React.FC<FontModalProps> = ({
  isOpen,
  onClose,
  selectedFont,
  onSelectFont,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Typography & Fonts</h2>
              <p className="text-xs text-slate-400">
                Choose the font styling that matches your personal brand.
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

        {/* FONT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {FONTS.map(font => {
            const isSelected = selectedFont === font.id;
            return (
              <button
                key={font.id}
                onClick={() => {
                  onSelectFont(font.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{font.name}</span>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-indigo-600 text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div
                  style={{ fontFamily: font.fontFamily }}
                  className="text-lg font-black text-white truncate tracking-tight py-1"
                >
                  Viral Headline 10x
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{font.preview}</span>
                  <span className="uppercase font-mono font-semibold text-indigo-400/80">
                    {font.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
