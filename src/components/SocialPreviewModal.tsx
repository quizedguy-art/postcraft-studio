import React, { useState } from 'react';
import type { Project, ThemeConfig } from '../types';
import { SlideCanvas } from './SlideCanvas';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  Send, 
  Heart, 
  Bookmark, 
  Share2 
} from 'lucide-react';

interface SocialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  theme: ThemeConfig;
  isPro: boolean;
}

export const SocialPreviewModal: React.FC<SocialPreviewModalProps> = ({
  isOpen,
  onClose,
  project,
  theme,
  isPro,
}) => {
  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'instagram'>('linkedin');
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  if (!isOpen) return null;

  const currentSlide = project.slides[previewSlideIdx] || project.slides[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Feed Simulator</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActivePlatform('linkedin')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activePlatform === 'linkedin' ? 'bg-[#0a66c2] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                LinkedIn Mockup
              </button>
              <button
                onClick={() => setActivePlatform('instagram')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activePlatform === 'instagram' ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Instagram Mockup
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FEED MOCKUP CONTAINER */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-2">
          {activePlatform === 'linkedin' ? (
            /* LINKEDIN MOCKUP */
            <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-xs space-y-3 p-4">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={project.brand.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={project.brand.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="font-bold text-white text-xs">{project.brand.name}</div>
                    <div className="text-[10px] text-slate-400">Founder • {project.brand.website}</div>
                    <div className="text-[9px] text-slate-500">2h • 🌐 Edited</div>
                  </div>
                </div>
                <button className="px-3 py-1 text-xs font-bold text-[#0a66c2] border border-[#0a66c2] rounded-full hover:bg-[#0a66c2]/10">
                  + Follow
                </button>
              </div>

              {/* Caption */}
              <p className="text-slate-200 text-xs leading-relaxed">
                Most people spend 40+ hours doing this the slow way. Here is the exact framework to scale your output without burnout ⬇️
              </p>

              {/* Slide Document Container */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900 flex items-center justify-center p-2">
                <SlideCanvas
                  slide={currentSlide}
                  brand={project.brand}
                  theme={theme}
                  aspectRatio={project.aspectRatio}
                  slideIndex={previewSlideIdx}
                  totalSlides={project.slides.length}
                  showWatermark={project.showWatermark && !isPro}
                  showSlideNumbers={project.showSlideNumbers}
                  showSwipeIndicator={project.showSwipeIndicator}
                  fontFamily={project.customFont}
                  scale={0.85}
                />
              </div>

              {/* Carousel Navigation Toolbar */}
              <div className="flex items-center justify-between text-slate-400 text-xs px-1">
                <button
                  disabled={previewSlideIdx === 0}
                  onClick={() => setPreviewSlideIdx(i => Math.max(0, i - 1))}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] text-slate-300">
                  {previewSlideIdx + 1} of {project.slides.length}
                </span>
                <button
                  disabled={previewSlideIdx === project.slides.length - 1}
                  onClick={() => setPreviewSlideIdx(i => Math.min(project.slides.length - 1, i + 1))}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Engagement metrics */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#0a66c2]" /> Like (384)
                </span>
                <span className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" /> Comment (47)
                </span>
                <span className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <Repeat className="w-3.5 h-3.5" /> Repost (62)
                </span>
                <span className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <Send className="w-3.5 h-3.5" /> Send
                </span>
              </div>
            </div>
          ) : (
            /* INSTAGRAM MOCKUP */
            <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-xs space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-600">
                    <img
                      src={project.brand.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={project.brand.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-slate-950"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{project.brand.handle}</div>
                    <div className="text-[9px] text-slate-400">Original audio</div>
                  </div>
                </div>
              </div>

              {/* Slide */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center p-2">
                <SlideCanvas
                  slide={currentSlide}
                  brand={project.brand}
                  theme={theme}
                  aspectRatio={project.aspectRatio}
                  slideIndex={previewSlideIdx}
                  totalSlides={project.slides.length}
                  showWatermark={project.showWatermark && !isPro}
                  showSlideNumbers={project.showSlideNumbers}
                  showSwipeIndicator={project.showSwipeIndicator}
                  fontFamily={project.customFont}
                  scale={0.85}
                />
              </div>

              {/* Instagram Actions */}
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <MessageSquare className="w-4 h-4" />
                  <Share2 className="w-4 h-4" />
                </div>
                <Bookmark className="w-4 h-4" />
              </div>

              <div className="text-[11px] font-bold text-white">1,492 likes</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
