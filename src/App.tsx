import { useState, useEffect, useCallback } from 'react';
import type { 
  Project, 
  Slide, 
  BrandKit, 
  UserSubscription,
  Template,
  ThemeConfig,
  FontFamilyId,
  ProjectSummary 
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
import { FontModal } from './components/FontModal';
import { ProjectsModal } from './components/ProjectsModal';
import { SocialPreviewModal } from './components/SocialPreviewModal';
import { CustomThemeModal } from './components/CustomThemeModal';
import { AuthModal } from './components/AuthModal';
import { 
  exportCarouselAsPdf, 
  exportCarouselAsZip, 
  exportSingleSlideAsPng,
  type ExportProgress 
} from './utils/exporter';
import { verifyLicenseKey } from './utils/license';
import { 
  supabase, 
  signOut as supabaseSignOut, 
  saveProjectToCloud, 
  fetchUserProjectsFromCloud, 
  fetchUserSubscription 
} from './utils/supabase';
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
  Undo2,
  Redo2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const STORAGE_KEY = 'slideforge_project_v1';
const ALL_PROJECTS_KEY = 'slideforge_all_projects_v1';
const SUBSCRIPTION_KEY = 'slideforge_sub_v1';

const DEFAULT_BRAND: BrandKit = {
  name: 'Alex Vance',
  handle: '@alex_builds',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  website: 'slideforge.io',
  isVerified: true,
};

const createNewDefaultProject = (title?: string): Project => ({
  id: `proj-${Date.now()}`,
  title: title || 'New High-Converting Deck',
  aspectRatio: '4:5',
  themeId: 'hyper-dark',
  brand: DEFAULT_BRAND,
  slides: TEMPLATES[0].slides,
  customFont: 'jakarta',
  showWatermark: true,
  showSlideNumbers: true,
  showSwipeIndicator: true,
  updatedAt: Date.now(),
  createdAt: Date.now(),
});

export function App() {
  // --- AUTH STATE ---
  const [user, setUser] = useState<any | null>(null);

  // --- MULTI-PROJECT STATE ---
  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(ALL_PROJECTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    const initial = createNewDefaultProject('7 Brutal Truths About Building Micro-SaaS');
    return [initial];
  });

  const [project, setProject] = useState<Project>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return allProjects[0] || createNewDefaultProject();
  });

  // Undo / Redo History Stack
  const [history, setHistory] = useState<Project[]>([project]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [customTheme, setCustomTheme] = useState<ThemeConfig | null>(null);

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isSocialPreviewOpen, setIsSocialPreviewOpen] = useState(false);
  const [isCustomThemeModalOpen, setIsCustomThemeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Subscription state
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem(SUBSCRIPTION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isPro) {
          const key = parsed.licenseKey?.trim();
          const isBypassKey = !key || key.startsWith('STRIPE-') || ['FOUNDER100', 'PROPASS', 'GROWTH2026', 'VIP'].includes(key);
          if (isBypassKey) {
            return {
              isPro: false,
              tier: 'free',
              exportsToday: 0,
              maxFreeExportsPerDay: 5,
            };
          }
        }
        return parsed;
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

  // Supabase Auth & Cloud Data Sync Listener
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        fetchUserProjectsFromCloud(activeUser.id).then(cloudProjects => {
          if (cloudProjects.length > 0) {
            setAllProjects(cloudProjects);
            setProject(cloudProjects[0]);
          } else {
            saveProjectToCloud(activeUser.id, project);
          }
        });
        fetchUserSubscription(activeUser.id).then(sub => {
          if (sub && sub.isPro) {
            setSubscription(prev => ({
              ...prev,
              isPro: true,
              tier: sub.tier || 'lifetime',
              licenseKey: sub.licenseKey,
            }));
            setProject(p => ({ ...p, showWatermark: false }));
          }
        });
      }
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        fetchUserProjectsFromCloud(activeUser.id).then(cloudProjects => {
          if (cloudProjects.length > 0) {
            setAllProjects(cloudProjects);
            setProject(cloudProjects[0]);
          } else {
            saveProjectToCloud(activeUser.id, project);
          }
        });
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  // Sync state to local storage & cloud
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    setAllProjects(prev => {
      const exists = prev.some(p => p.id === project.id);
      const updated = exists
        ? prev.map(p => (p.id === project.id ? { ...project, updatedAt: Date.now() } : p))
        : [...prev, { ...project, updatedAt: Date.now() }];
      localStorage.setItem(ALL_PROJECTS_KEY, JSON.stringify(updated));
      return updated;
    });

    // Cloud backup if user is authenticated
    if (user?.id) {
      saveProjectToCloud(user.id, project);
    }
  }, [project, user]);

  useEffect(() => {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  }, [subscription]);

  // Verify license key on boot if user is marked Pro
  useEffect(() => {
    if (subscription.isPro && subscription.licenseKey) {
      verifyLicenseKey(subscription.licenseKey).then(res => {
        if (!res.valid) {
          setSubscription({
            isPro: false,
            tier: 'free',
            exportsToday: 0,
            maxFreeExportsPerDay: 5,
          });
          setProject(prev => ({ ...prev, showWatermark: true }));
        }
      });
    }
  }, []);

  // Return listener from Lemon Squeezy checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const licenseKey = params.get('license_key') || params.get('key');

    if (licenseKey && !subscription.isPro) {
      verifyLicenseKey(licenseKey).then(res => {
        if (res.valid) {
          handleUpgrade(res.tier || 'lifetime', licenseKey);
        }
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Update project state with undo history recording
  const updateProjectWithHistory = useCallback((updater: (prev: Project) => Project) => {
    setProject(prev => {
      const next = updater(prev);
      setHistory(h => {
        const nextHistory = h.slice(0, historyIndex + 1);
        return [...nextHistory, next];
      });
      setHistoryIndex(i => i + 1);
      return next;
    });
  }, [historyIndex]);

  // Undo / Redo Actions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const target = history[historyIndex - 1];
      setHistoryIndex(i => i - 1);
      setProject(target);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1];
      setHistoryIndex(i => i + 1);
      setProject(target);
    }
  };

  // Keyboard shortcuts for Undo (Ctrl+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Active theme resolution
  const currentTheme = project.themeId === 'custom' && customTheme
    ? customTheme
    : THEMES.find(t => t.id === project.themeId) || THEMES[0];

  const activeSlide = project.slides[activeSlideIndex] || project.slides[0];

  // Upgrades
  const handleUpgrade = (tier: 'pro' | 'lifetime', key?: string) => {
    setSubscription({
      ...subscription,
      isPro: true,
      tier,
      licenseKey: key,
    });
    setProject(prev => ({ ...prev, showWatermark: false }));
  };

  // Slide management
  const handleUpdateSlide = (updated: Slide) => {
    updateProjectWithHistory(prev => {
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
    updateProjectWithHistory(prev => ({
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
    updateProjectWithHistory(prev => {
      const slides = [...prev.slides];
      slides.splice(index + 1, 0, newSlide);
      return { ...prev, slides };
    });
    setActiveSlideIndex(index + 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (project.slides.length <= 1) return;
    updateProjectWithHistory(prev => {
      const slides = prev.slides.filter((_, i) => i !== index);
      return { ...prev, slides };
    });
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= project.slides.length) return;

    updateProjectWithHistory(prev => {
      const slides = [...prev.slides];
      const temp = slides[index];
      slides[index] = slides[targetIdx];
      slides[targetIdx] = temp;
      return { ...prev, slides };
    });
    setActiveSlideIndex(targetIdx);
  };

  const handleSelectTemplate = (tpl: Template) => {
    updateProjectWithHistory(prev => ({
      ...prev,
      title: tpl.title,
      slides: tpl.slides,
    }));
    setActiveSlideIndex(0);
  };

  const handleAIGenerate = (slides: Slide[]) => {
    updateProjectWithHistory(prev => ({
      ...prev,
      slides,
    }));
    setActiveSlideIndex(0);
  };

  // Multi-Project Handlers
  const handleLoadProject = (id: string) => {
    const found = allProjects.find(p => p.id === id);
    if (found) {
      setProject(found);
      setActiveSlideIndex(0);
      setHistory([found]);
      setHistoryIndex(0);
    }
  };

  const handleCreateNewProject = () => {
    const newProj = createNewDefaultProject();
    setAllProjects(prev => [...prev, newProj]);
    setProject(newProj);
    setActiveSlideIndex(0);
    setHistory([newProj]);
    setHistoryIndex(0);
  };

  const handleDeleteProject = (id: string) => {
    if (allProjects.length <= 1) return;
    const remaining = allProjects.filter(p => p.id !== id);
    setAllProjects(remaining);
    localStorage.setItem(ALL_PROJECTS_KEY, JSON.stringify(remaining));
    if (project.id === id) {
      setProject(remaining[0]);
      setActiveSlideIndex(0);
    }
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

  const projectSummaries: ProjectSummary[] = allProjects.map(p => ({
    id: p.id,
    title: p.title,
    slideCount: p.slides.length,
    aspectRatio: p.aspectRatio,
    themeId: p.themeId,
    updatedAt: p.updatedAt || Date.now(),
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* NAVBAR */}
      <Navbar
        aspectRatio={project.aspectRatio}
        onAspectRatioChange={ratio => updateProjectWithHistory(p => ({ ...p, aspectRatio: ratio }))}
        selectedThemeId={project.themeId}
        onThemeChange={themeId => updateProjectWithHistory(p => ({ ...p, themeId }))}
        selectedFont={project.customFont || 'jakarta'}
        subscription={subscription}
        projectCount={allProjects.length}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={async () => {
          await supabaseSignOut();
          setUser(null);
        }}
        onOpenProjects={() => setIsProjectsModalOpen(true)}
        onOpenFontModal={() => setIsFontModalOpen(true)}
        onOpenSocialPreview={() => setIsSocialPreviewOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenBrandKit={() => setIsBrandKitModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
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
        {/* LEFT SIDEBAR: SLIDES THUMBNAILS & REORDER */}
        <aside className="w-64 sm:w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Slides ({project.slides.length})
            </span>
            <button
              onClick={handleAddSlide}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* SLIDE THUMBNAIL LIST WITH MOVE UP/DOWN CONTROLS */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {project.slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  activeSlideIndex === idx
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Index / Reorder arrows */}
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <button
                    disabled={idx === 0}
                    onClick={e => {
                      e.stopPropagation();
                      handleMoveSlide(idx, 'up');
                    }}
                    title="Move Slide Up"
                    className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                    {idx + 1}
                  </div>
                  <button
                    disabled={idx === project.slides.length - 1}
                    onClick={e => {
                      e.stopPropagation();
                      handleMoveSlide(idx, 'down');
                    }}
                    title="Move Slide Down"
                    className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
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
                    title="Duplicate Slide"
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
                      title="Delete Slide"
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
          <div className="p-3.5 border-t border-slate-800 bg-slate-950/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> Themes & Palettes
              </span>
              <button
                onClick={() => setIsCustomThemeModalOpen(true)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                + Custom
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
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
                        updateProjectWithHistory(p => ({ ...p, themeId: th.id }));
                      }
                    }}
                    className={`relative h-9 rounded-xl bg-gradient-to-br ${th.previewClass} border transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-indigo-400 border-white scale-105 shadow-md'
                        : 'border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    {isLocked && (
                      <span className="absolute -top-1 -right-1 p-0.5 bg-amber-500 rounded-full text-slate-950">
                        <Lock className="w-2 h-2" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CENTER STAGE: LIVE CANVAS PREVIEW & TOOLBAR */}
        <main className="flex-1 flex flex-col bg-slate-900/40 relative overflow-hidden">
          {/* Top Stage Controls: Project Title, Undo/Redo, Zoom & Quick Nav */}
          <div className="p-3 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            {/* Title & Undo/Redo */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={project.title}
                onChange={e => updateProjectWithHistory(p => ({ ...p, title: e.target.value }))}
                className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 text-slate-200 font-bold text-xs px-1 py-0.5 max-w-xs focus:outline-none"
                placeholder="Carousel Title..."
              />

              <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title="Undo (Ctrl+Z)"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-25 hover:bg-slate-800 cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo (Ctrl+Y)"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-25 hover:bg-slate-800 cursor-pointer"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Slide Navigation & Zoom */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(i => Math.max(0, i - 1))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-slate-300 text-[11px]">
                  {activeSlideIndex + 1} / {project.slides.length}
                </span>
                <button
                  disabled={activeSlideIndex === project.slides.length - 1}
                  onClick={() => setActiveSlideIndex(i => Math.min(project.slides.length - 1, i + 1))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
                <button
                  onClick={() => setZoomLevel(z => Math.max(0.7, z - 0.1))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] w-10 text-center">
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
                fontFamily={project.customFont}
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
                fontFamily={project.customFont}
                scale={1}
              />
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR: SLIDE INSPECTOR */}
        <aside className="w-80 sm:w-96 bg-slate-950 border-l border-slate-800 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Slide Customizer
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Editing #{activeSlideIndex + 1}
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {activeSlide && (
              <SlideEditor
                slide={activeSlide}
                onChange={handleUpdateSlide}
                onDelete={() => handleDeleteSlide(activeSlideIndex)}
                canDelete={project.slides.length > 1}
              />
            )}
          </div>

          {/* Watermark & Deck Settings */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Remove Watermark</span>
              {subscription.isPro ? (
                <input
                  type="checkbox"
                  checked={!project.showWatermark}
                  onChange={e => updateProjectWithHistory(p => ({ ...p, showWatermark: !e.target.checked }))}
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
                onChange={e => updateProjectWithHistory(p => ({ ...p, showSlideNumbers: e.target.checked }))}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ALL MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

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
        onChange={brand => updateProjectWithHistory(p => ({ ...p, brand }))}
      />

      <FontModal
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        selectedFont={project.customFont || 'jakarta'}
        onSelectFont={(font: FontFamilyId) => updateProjectWithHistory(p => ({ ...p, customFont: font }))}
      />

      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        currentProjectId={project.id}
        savedProjects={projectSummaries}
        onLoadProject={handleLoadProject}
        onCreateNewProject={handleCreateNewProject}
        onDeleteProject={handleDeleteProject}
      />

      <SocialPreviewModal
        isOpen={isSocialPreviewOpen}
        onClose={() => setIsSocialPreviewOpen(false)}
        project={project}
        theme={currentTheme}
        isPro={subscription.isPro}
      />

      <CustomThemeModal
        isOpen={isCustomThemeModalOpen}
        onClose={() => setIsCustomThemeModalOpen(false)}
        onSaveCustomTheme={custom => {
          setCustomTheme(custom);
          updateProjectWithHistory(p => ({ ...p, themeId: 'custom' }));
        }}
        isPro={subscription.isPro}
        onOpenPricing={() => setIsPricingModalOpen(true)}
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
    </div>
  );
}

export default App;
