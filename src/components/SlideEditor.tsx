import React from 'react';
import type { Slide, SlideType } from '../types';
import { Layout, Type, BarChart3, Quote, Terminal, ArrowRight, Trash2, Plus } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  onChange: (updated: Slide) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  onChange,
  onDelete,
  canDelete,
}) => {
  const slideTypes: { type: SlideType; label: string; icon: React.ReactNode }[] = [
    { type: 'cover', label: 'Cover', icon: <Type className="w-3.5 h-3.5" /> },
    { type: 'content', label: 'Content', icon: <Layout className="w-3.5 h-3.5" /> },
    { type: 'stats', label: 'Metrics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { type: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
    { type: 'tweet', label: 'Tweet', icon: <Type className="w-3.5 h-3.5" /> },
    { type: 'code', label: 'Code', icon: <Terminal className="w-3.5 h-3.5" /> },
    { type: 'cta', label: 'Call to Action', icon: <ArrowRight className="w-3.5 h-3.5" /> },
  ];

  const handleAddBullet = () => {
    const bullets = slide.bulletPoints || [];
    onChange({
      ...slide,
      bulletPoints: [...bullets, 'New actionable takeaway'],
    });
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const bullets = [...(slide.bulletPoints || [])];
    bullets[index] = val;
    onChange({ ...slide, bulletPoints: bullets });
  };

  const handleDeleteBullet = (index: number) => {
    const bullets = [...(slide.bulletPoints || [])];
    bullets.splice(index, 1);
    onChange({ ...slide, bulletPoints: bullets });
  };

  return (
    <div className="space-y-6 text-sm">
      {/* SLIDE TYPE SELECTOR */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Slide Layout Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {slideTypes.map(st => (
            <button
              key={st.type}
              onClick={() => onChange({ ...slide, type: st.type })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                slide.type === st.type
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st.icon}
              <span>{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAG / BADGE */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Badge / Topic Tag
        </label>
        <input
          type="text"
          value={slide.tag || ''}
          onChange={e => onChange({ ...slide, tag: e.target.value })}
          placeholder="e.g. ⚡ Rule #01 or Case Study"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* HEADLINE */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Headline / Main Hook
        </label>
        <textarea
          rows={2}
          value={slide.headline}
          onChange={e => onChange({ ...slide, headline: e.target.value })}
          placeholder="Write a clear, punchy headline..."
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      {/* SUBTITLE (FOR COVER / CTA / STATS) */}
      {(slide.type === 'cover' || slide.type === 'cta' || slide.type === 'stats') && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Subtitle / Explainer
          </label>
          <textarea
            rows={2}
            value={slide.subtitle || ''}
            onChange={e => onChange({ ...slide, subtitle: e.target.value })}
            placeholder="Add context or a supporting hook..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      )}

      {/* BODY PARAGRAPH (FOR CONTENT / TWEET) */}
      {(slide.type === 'content' || slide.type === 'tweet' || slide.type === 'code') && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Body Paragraph
          </label>
          <textarea
            rows={3}
            value={slide.body || ''}
            onChange={e => onChange({ ...slide, body: e.target.value })}
            placeholder="Explain the key idea in depth..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* BULLET POINTS (FOR CONTENT) */}
      {slide.type === 'content' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Takeaway Bullets
            </label>
            <button
              onClick={handleAddBullet}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
          {(slide.bulletPoints || []).map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={bullet}
                onChange={e => handleUpdateBullet(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleDeleteBullet(idx)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CODE SNIPPET (FOR CODE) */}
      {slide.type === 'code' && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Code Snippet
          </label>
          <textarea
            rows={4}
            value={slide.codeSnippet || ''}
            onChange={e => onChange({ ...slide, codeSnippet: e.target.value })}
            placeholder="const revenue = monthlySubscribers * 12;"
            className="w-full px-3 py-2 bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* QUOTE AUTHOR (FOR QUOTE) */}
      {slide.type === 'quote' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Quote Author
            </label>
            <input
              type="text"
              value={slide.quoteAuthor || ''}
              onChange={e => onChange({ ...slide, quoteAuthor: e.target.value })}
              placeholder="e.g. Steve Jobs"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Role / Title
            </label>
            <input
              type="text"
              value={slide.quoteRole || ''}
              onChange={e => onChange({ ...slide, quoteRole: e.target.value })}
              placeholder="e.g. Founder, Apple"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* CTA BUTTON SETTINGS */}
      {slide.type === 'cta' && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Call to Action Button Text
          </label>
          <input
            type="text"
            value={slide.ctaButtonText || ''}
            onChange={e => onChange({ ...slide, ctaButtonText: e.target.value })}
            placeholder="e.g. Get the Free Blueprint 🚀"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* DELETE SLIDE */}
      {canDelete && (
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete This Slide
          </button>
        </div>
      )}
    </div>
  );
};
