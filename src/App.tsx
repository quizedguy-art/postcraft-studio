import { useState, useEffect } from 'react';
import type { 
  Project, 
  Slide, 
  BrandKit, 
  UserSubscription,
  Template 
} from './types';
import { THEMES } from './data/themes';
import { TEMPLATES } from './data/templates';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideEditor } from './components/SlideEditor';
import { Navbar } from './components/Navbar';
import { BrandKitModal } from './components/BrandKitModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { TemplatesModal } from './components/TemplatesModal';
import { PricingModal } from './components/PricingModal';
import { MonetizationGuideModal } from './components/MonetizationGuideModal';
import { 
  exportCarouselAsPdf, 
  exportCarouselAsZip, 
  exportSingleSlideAsPng,
  type ExportProgress 
} from './utils/exporter';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  Sliders, 
  Lock, 
  Check, 
  ZoomIn, 
  ZoomOut,
  RefreshCw,
} from 'lucide-react';

const STORAGE_KEY = 'slideforge_project_v1';
const SUBSCRIPTION_KEY = 'slideforge_sub_v1';

const DEFAULT_BRAND: BrandKit = {
  name: 'Alex Vance',
  handle: '@alex_builds',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  website: 'slideforge.io',
  isVerified: true,
};

export function App() {
  // --- STATE ---
  const [project, setProject] = useState<Project>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'proj-1',
      title: '7 Brutal Truths About Building Micro-SaaS',
      aspectRatio: '4:5',
      themeId: 'hyper-dark',
      brand: DEFAULT_BRAND,
      slides: TEMPLATES[0].slides,
      customFont: 'sans',
      showWatermark: true,
      showSlideNumbers: true,
      showSwipeIndicator: true,
    };
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Subscription state
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem(SUBSCRIPTION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      isPro: false,
      tier: 'free',
      exportsToday: 0,
      maxFreeExportsPerDay: 5,
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  }, [subscription]);

  // Listen for return from Stripe / Lemon Squeezy checkout via URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('checkout_success') === 'true' || params.get('success') === 'true';
    const tier = (params.get('tier') as 'pro' | 'lifetime') || 'lifetime';

    if (isSuccess && !subscription.isPro) {
      handleUpgrade(tier, `STRIPE-${Date.now().toString(36).toUpperCase()}`);
      // Clean query string
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Active theme
  const currentTheme = THEMES.find(t => t.id === project.themeId) || THEMES[0];
  const activeSlide = project.slides[activeSlideIndex] || project.slides[0];

  // Handlers
  const handleUpgrade = (tier: 'pro' | 'lifetime', key?: string) => {
    setSubscription({
      ...subscription,
      isPro: true,
      tier,
      licenseKey: key,
    });
    setProject(prev => ({ ...prev, showWatermark: false }));
  };

  const handleUpdateSlide = (updated: Slide) => {
    setProject(prev => {
      const slides = [...prev.slides];
      slides[activeSlideIndex] = updated;
      return { ...prev, slides };
    });
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: 'content',
      tag: `Insight 0${project.slides.length + 1}`,
      headline: 'Next Core Takeaway',
      body: 'Add your strategic explanation or detailed step-by-step guidance here.',
      bulletPoints: ['First key observation', 'Second key takeaway'],
    };
    setProject(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
    setActiveSlideIndex(project.slides.length);
  };

  const handleDuplicateSlide = (index: number) => {
    const slideToCopy = project.slides[index];
    const newSlide: Slide = {
      ...slideToCopy,
      id: `slide-${Date.now()}`,
      headline: `${slideToCopy.headline} (Copy)`,
    };
    setProject(prev => {
      const slides = [...prev.slides];
      slides.splice(index + 1, 0, newSlide);
      return { ...prev, slides };
    });
    setActiveSlideIndex(index + 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (project.slides.length <= 1) return;
    setProject(prev => {
      const slides = prev.slides.filter((_, i) => i !== index);
      return { ...prev, slides };
    });
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  const handleSelectTemplate = (tpl: Template) => {
    setProject(prev => ({
      ...prev,
      title: tpl.title,
      slides: tpl.slides,
    }));
    setActiveSlideIndex(0);
  };

  const handleAIGenerate = (slides: Slide[]) => {
    setProject(prev => ({
      ...prev,
      slides,
    }));
    setActiveSlideIndex(0);
  };

  // Export handlers
  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const slideIds = project.slides.map(s => `export-slide-${s.id}`);
      await exportCarouselAsPdf(
        slideIds,
        project.aspectRatio,
        `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-carousel.pdf`,
        progress => setExportProgress(progress)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const slideIds = project.slides.map(s => `export-slide-${s.id}`);
      await exportCarouselAsZip(
        slideIds,
        `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-slides`,
        progress => setExportProgress(progress)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handleExportPng = async () => {
    if (!activeSlide) return;
    setIsExporting(true);
    try {
      await exportSingleSlideAsPng(
        `export-slide-${activeSlide.id}`,
        `slide-${activeSlideIndex + 1}.png`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* NAVBAR */}
      <Navbar
        aspectRatio={project.aspectRatio}
        onAspectRatioChange={ratio => setProject(p => ({ ...p, aspectRatio: ratio }))}
        selectedThemeId={project.themeId}
        onThemeChange={themeId => setProject(p => ({ ...p, themeId }))}
        subscription={subscription}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenBrandKit={() => setIsBrandKitModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onExportPdf={handleExportPdf}
        onExportZip={handleExportZip}
        onExportPng={handleExportPng}
        isExporting={isExporting}
      />

      {/* EXPORT PROGRESS BANNER */}
      {exportProgress && (
        <div className="bg-indigo-600 px-4 py-2 text-center text-xs font-semibold text-white animate-pulse flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{exportProgress.status}</span>
        </div>
      )}

      {/* MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: SLIDES THUMBNAILS & THEME PALETTE */}
        <aside className="w-64 sm:w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Slides ({project.slides.length})
              </span>
            </div>
            <button
              onClick={handleAddSlide}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slide
            </button>
          </div>

          {/* SLIDE THUMBNAIL LIST */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {project.slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeSlideIndex === idx
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[11px] font-mono font-bold text-slate-400 shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase text-indigo-400 font-semibold truncate">
                    {slide.type} • {slide.tag || 'Slide'}
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate">
                    {slide.headline || 'Untitled Slide'}
                  </div>
                </div>

                {/* Actions on hover */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDuplicateSlide(idx);
                    }}
                    title="Duplicate"
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {project.slides.length > 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      title="Delete"
                      className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* THEME PICKER DRAWER */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> Color Aesthetics
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {THEMES.map(th => {
                const isSelected = project.themeId === th.id;
                const isLocked = th.isPro && !subscription.isPro;
                return (
                  <button
                    key={th.id}
                    title={th.name}
                    onClick={() => {
                      if (isLocked) {
                        setIsPricingModalOpen(true);
                      } else {
                        setProject(p => ({ ...p, themeId: th.id }));
                      }
                    }}
                    className={`relative h-10 rounded-xl bg-gradient-to-br ${th.previewClass} border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-indigo-400 border-white scale-105'
                        : 'border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    {isLocked && (
                      <span className="absolute -top-1 -right-1 p-0.5 bg-amber-500 rounded-full text-slate-950">
                        <Lock className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CENTER STAGE: LIVE CANVAS PREVIEW */}
        <main className="flex-1 flex flex-col bg-slate-900/40 relative overflow-hidden">
          {/* Top Stage Controls: Zoom & Quick Nav */}
          <div className="p-3 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex(i => Math.max(0, i - 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300">
                Slide {activeSlideIndex + 1} of {project.slides.length}
              </span>
              <button
                disabled={activeSlideIndex === project.slides.length - 1}
                onClick={() => setActiveSlideIndex(i => Math.min(project.slides.length - 1, i + 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.7, z - 0.1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.3, z + 0.1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE PREVIEW */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            {activeSlide && (
              <SlideCanvas
                slide={activeSlide}
                brand={project.brand}
                theme={currentTheme}
                aspectRatio={project.aspectRatio}
                slideIndex={activeSlideIndex}
                totalSlides={project.slides.length}
                showWatermark={project.showWatermark && !subscription.isPro}
                showSlideNumbers={project.showSlideNumbers}
                showSwipeIndicator={project.showSwipeIndicator}
                scale={zoomLevel}
                isSelected={false}
              />
            )}
          </div>

          {/* HIDDEN OFFSCREEN RENDER CONTAINERS FOR HIGH-DPI EXPORT */}
          <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
            {project.slides.map((s, i) => (
              <SlideCanvas
                key={s.id}
                idPrefix="export-slide"
                slide={s}
                brand={project.brand}
                theme={currentTheme}
                aspectRatio={project.aspectRatio}
                slideIndex={i}
                totalSlides={project.slides.length}
                showWatermark={project.showWatermark && !subscription.isPro}
                showSlideNumbers={project.showSlideNumbers}
                showSwipeIndicator={project.showSwipeIndicator}
                scale={1}
              />
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR: SLIDE INSPECTOR */}
        <aside className="w-80 sm:w-96 bg-slate-950 border-l border-slate-800 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Slide Customizer
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Editing #{activeSlideIndex + 1}
            </span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto">
            {activeSlide && (
              <SlideEditor
                slide={activeSlide}
                onChange={handleUpdateSlide}
                onDelete={() => handleDeleteSlide(activeSlideIndex)}
                canDelete={project.slides.length > 1}
              />
            )}
          </div>

          {/* Watermark toggle */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Remove Watermark</span>
              {subscription.isPro ? (
                <input
                  type="checkbox"
                  checked={!project.showWatermark}
                  onChange={e => setProject(p => ({ ...p, showWatermark: !e.target.checked }))}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              ) : (
                <button
                  onClick={() => setIsPricingModalOpen(true)}
                  className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" /> Pro Only
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Show Slide Numbers</span>
              <input
                type="checkbox"
                checked={project.showSlideNumbers}
                onChange={e => setProject(p => ({ ...p, showSlideNumbers: e.target.checked }))}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* MODALS */}
      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
        isPro={subscription.isPro}
        onUpgradePrompt={() => setIsPricingModalOpen(true)}
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <BrandKitModal
        isOpen={isBrandKitModalOpen}
        onClose={() => setIsBrandKitModalOpen(false)}
        brand={project.brand}
        onChange={brand => setProject(p => ({ ...p, brand }))}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        subscription={subscription}
        onUpgrade={handleUpgrade}
        onResetToFree={() => {
          setSubscription({
            isPro: false,
            tier: 'free',
            exportsToday: 0,
            maxFreeExportsPerDay: 5,
          });
          setProject(p => ({ ...p, showWatermark: true }));
        }}
      />


      <MonetizationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}

export default App;
