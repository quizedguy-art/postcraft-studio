import React from 'react';
import { TEMPLATES } from '../data/templates';
import type { Template } from '../types';
import { LayoutTemplate, Sparkles, X } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Viral Carousel Templates</h2>
              <p className="text-xs text-slate-400">
                Battle-tested frameworks with high engagement and conversion rates.
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

        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => {
                  onSelectTemplate(tpl);
                  onClose();
                }}
                className="group relative p-5 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-indigo-500 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                      {tpl.badge}
                    </span>
                    <span className="text-[11px] text-slate-500">{tpl.slides.length} slides</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tpl.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-indigo-400 font-medium group-hover:underline flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Use Template
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
