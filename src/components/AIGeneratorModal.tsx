import React, { useState } from 'react';
import type { Slide } from '../types';
import { generateCarouselAI, parseMarkdownToCarousel } from '../utils/aiGenerator';
import { 
  Sparkles, 
  FileText, 
  Wand2, 
  X, 
  AlertCircle, 
  Key, 
  Loader2
} from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (slides: Slide[]) => void;
  isPro: boolean;
  onUpgradePrompt: () => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [tab, setTab] = useState<'prompt' | 'markdown'>('prompt');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'professional' | 'hype' | 'educational' | 'story' | 'minimal'>('educational');
  const [slideCount, setSlideCount] = useState<number>(5);
  const [markdownText, setMarkdownText] = useState('');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    }

    try {
      if (tab === 'prompt') {
        const generated = await generateCarouselAI({
          topic: topic || 'The 5 High-Leverage Skills of High-Income Solopreneurs',
          tone,
          slideCount,
          apiKey: apiKey.trim() || undefined,
        });
        onGenerate(generated);
      } else {
        const parsed = parseMarkdownToCarousel(markdownText);
        onGenerate(parsed);
      }
      onClose();
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleIdeas = [
    '7 harsh truths about scaling a B2B SaaS in 2026',
    'How to land high-ticket clients with cold DMs that actually work',
    'Full-stack developer roadmap from beginner to $150k engineer',
    'The psychology behind why high-converting landing pages sell',
    '5 automated workflows saving 20 hours a week for creators',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Carousel Studio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  Gemini & Smart Heuristics
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Turn any idea, tweet thread, or article into an engaging visual deck.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setTab('prompt')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${
              tab === 'prompt' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Generate from Topic
          </button>
          <button
            onClick={() => setTab('markdown')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${
              tab === 'markdown' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste Markdown / Thread
          </button>
        </div>

        {tab === 'prompt' ? (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                What is your carousel topic or hook?
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. 5 things I learned scaling an agency to $20k/mo with zero employees..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500 font-medium">Click to try:</span>
                {sampleIdeas.slice(0, 3).map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setTopic(idea)}
                    className="text-[11px] text-indigo-400 hover:underline bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 truncate max-w-xs"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="educational">💡 Educational & Structured</option>
                  <option value="hype">🔥 High-Energy & Viral</option>
                  <option value="professional">📊 SaaS / B2B Professional</option>
                  <option value="story">📖 Personal Story & Case Study</option>
                  <option value="minimal">⚡ Minimalist & Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Slide Count ({slideCount} slides)
                </label>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={slideCount}
                  onChange={e => setSlideCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 mt-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Optional Gemini API Key Toggle */}
            <div className="pt-1">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Key className="w-3 h-3" />
                {apiKey ? 'Custom Gemini API Key Connected' : 'Use your own Google Gemini API Key (Optional)'}
              </button>

              {showKeyInput && (
                <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Google AI Gemini Key (Free from Google AI Studio)</span>
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Paste Raw Text / Markdown / Tweet Thread
            </label>
            <textarea
              rows={6}
              value={markdownText}
              onChange={e => setMarkdownText(e.target.value)}
              placeholder="# Headline for Slide 1&#10;Subtitle or context here...&#10;&#10;## Point 1: Execution beats ideas&#10;- Action point 1&#10;- Action point 2&#10;&#10;## Call to Action&#10;Follow for more insights"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Replaces current slides</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isGenerating ? 'Synthesizing Decks...' : 'Generate Carousel'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
