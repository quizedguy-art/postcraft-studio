import React from 'react';
import type { BrandKit } from '../types';
import { X, User, Globe, AtSign } from 'lucide-react';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandKit;
  onChange: (updated: BrandKit) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
];

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  isOpen,
  onClose,
  brand,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Brand & Creator Identity</h2>
              <p className="text-xs text-slate-400">
                This appears on all your slides and exports automatically.
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

        <div className="space-y-4 text-sm">
          {/* AVATAR SELECTOR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Profile Picture / Logo
            </label>
            <div className="flex items-center gap-4">
              <img
                src={brand.avatar || PRESET_AVATARS[0]}
                alt="Avatar"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500 shadow-md"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={brand.avatar}
                  onChange={e => onChange({ ...brand, avatar: e.target.value })}
                  placeholder="Paste direct image URL..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Or pick preset:</span>
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onChange({ ...brand, avatar: url })}
                      className="w-6 h-6 rounded-full overflow-hidden hover:scale-110 transition-transform ring-1 ring-slate-700"
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NAME */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name or Brand Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={brand.name}
                onChange={e => onChange({ ...brand, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* HANDLE */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Handle / Username
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={brand.handle}
                onChange={e => onChange({ ...brand, handle: e.target.value })}
                placeholder="e.g. @sarah_builds"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* WEBSITE */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Website / CTA Link
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={brand.website}
                onChange={e => onChange({ ...brand, website: e.target.value })}
                placeholder="e.g. myproduct.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* VERIFIED BADGE TOGGLE */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div>
              <div className="text-xs font-bold text-white">Show Verified Badge</div>
              <div className="text-[11px] text-slate-400">Display blue checkmark next to your name</div>
            </div>
            <input
              type="checkbox"
              checked={!!brand.isVerified}
              onChange={e => onChange({ ...brand, isVerified: e.target.checked })}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/20"
          >
            Save Brand Kit
          </button>
        </div>
      </div>
    </div>
  );
};
