import React from 'react';
import type { Slide, BrandKit, ThemeConfig, AspectRatio, FontFamilyId } from '../types';
import { getFontFamily } from '../data/fonts';
import { CheckCircle2, ChevronRight, Sparkles, Quote, Terminal, ArrowRight } from 'lucide-react';

interface SlideCanvasProps {
  slide: Slide;
  brand: BrandKit;
  theme: ThemeConfig;
  aspectRatio: AspectRatio;
  slideIndex: number;
  totalSlides: number;
  showWatermark: boolean;
  showSlideNumbers: boolean;
  showSwipeIndicator: boolean;
  fontFamily?: FontFamilyId;
  scale?: number;
  isSelected?: boolean;
  onClick?: () => void;
  idPrefix?: string;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  brand,
  theme,
  aspectRatio,
  slideIndex,
  totalSlides,
  showWatermark,
  showSlideNumbers,
  showSwipeIndicator,
  fontFamily = 'jakarta',
  scale = 1,
  isSelected = false,
  onClick,
  idPrefix = 'slide-canvas',
}) => {
  // Determine aspect ratio class / dimensions
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '4:5':
        return 'w-[400px] h-[500px]'; // LinkedIn & IG optimal
      case '1:1':
        return 'w-[450px] h-[450px]'; // Square
      case '16:9':
        return 'w-[533px] h-[300px]'; // Twitter Landscape
      case '9:16':
        return 'w-[300px] h-[533px]'; // Story / Reels
      default:
        return 'w-[400px] h-[500px]';
    }
  };

  const isNeo = theme.id === 'neo-brutal';
  const activeFontFamily = getFontFamily(fontFamily);

  return (
    <div
      id={`${idPrefix}-${slide.id}`}
      onClick={onClick}
      style={{ 
        transform: scale !== 1 ? `scale(${scale})` : undefined, 
        transformOrigin: 'top left',
        fontFamily: activeFontFamily
      }}
      className={`relative select-none flex flex-col justify-between p-7 sm:p-8 overflow-hidden rounded-2xl transition-all duration-200 ${getAspectRatioClasses()} ${
        slide.customBg || theme.bgGradient
      } ${isSelected ? 'ring-4 ring-indigo-500 shadow-2xl scale-[1.01]' : 'shadow-xl'}`}
    >
      {/* Background Image Layer if position is background */}
      {slide.imageUrl && slide.imagePosition === 'background' && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={slide.imageUrl}
            alt="Background Media"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/40" />
        </div>
      )}

      {/* Subtle Background Glow Elements */}
      {!isNeo && !slide.imageUrl && (
        <>
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        </>
      )}

      {/* TOP BAR: Tag / Badge & Slide Counter */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {slide.tag ? (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${
              theme.tagBg
            } ${theme.tagText}`}
          >
            <Sparkles className="w-3 h-3" />
            {slide.tag}
          </span>
        ) : (
          <div />
        )}

        {showSlideNumbers && (
          <span className={`text-xs font-mono font-bold opacity-75 ${theme.textColor}`}>
            {slideIndex + 1} / {totalSlides}
          </span>
        )}
      </div>

      {/* CENTER CONTENT BASED ON SLIDE TYPE */}
      <div className="relative z-10 my-auto flex flex-col justify-center gap-3.5 py-3">
        {/* Top Attached Image */}
        {slide.imageUrl && slide.imagePosition === 'top' && (
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg max-h-36 mb-1 bg-black/40">
            <img
              src={slide.imageUrl}
              alt="Slide Diagram"
              className="w-full h-36 object-cover"
            />
            {slide.imageCaption && (
              <div className={`p-1.5 text-[10px] text-center opacity-75 ${theme.textColor}`}>
                {slide.imageCaption}
              </div>
            )}
          </div>
        )}

        {/* COVER SLIDE */}
        {slide.type === 'cover' && (
          <div className={`space-y-3.5 ${slide.alignment === 'center' ? 'text-center' : 'text-left'}`}>
            <h1
              className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${theme.headlineColor}`}
            >
              {slide.headline}
            </h1>
            {slide.subtitle && (
              <p className={`text-xs sm:text-sm leading-relaxed opacity-90 ${theme.textColor}`}>
                {slide.subtitle}
              </p>
            )}
          </div>
        )}

        {/* CONTENT SLIDE WITH BULLETS */}
        {slide.type === 'content' && (
          <div className="space-y-3 text-left">
            <h2 className={`text-xl sm:text-2xl font-black leading-snug tracking-tight ${theme.headlineColor}`}>
              {slide.headline}
            </h2>
            {slide.body && (
              <p className={`text-xs sm:text-sm leading-relaxed opacity-90 ${theme.textColor}`}>
                {slide.body}
              </p>
            )}
            {slide.bulletPoints && slide.bulletPoints.length > 0 && (
              <div className="space-y-2 pt-1">
                {slide.bulletPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`mt-0.5 p-0.5 rounded-full ${theme.accentBg} text-white shrink-0 shadow-sm`}>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium leading-snug ${theme.textColor}`}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Middle Attached Image */}
        {slide.imageUrl && slide.imagePosition === 'middle' && (
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg max-h-32 my-1 bg-black/40">
            <img
              src={slide.imageUrl}
              alt="Slide Diagram"
              className="w-full h-32 object-cover"
            />
            {slide.imageCaption && (
              <div className={`p-1.5 text-[10px] text-center opacity-75 ${theme.textColor}`}>
                {slide.imageCaption}
              </div>
            )}
          </div>
        )}

        {/* STATS / METRICS SLIDE */}
        {slide.type === 'stats' && (
          <div className="space-y-3 text-left">
            <h2 className={`text-xl sm:text-2xl font-black leading-snug ${theme.headlineColor}`}>
              {slide.headline}
            </h2>
            {slide.subtitle && (
              <p className={`text-xs opacity-80 ${theme.textColor}`}>{slide.subtitle}</p>
            )}
            {slide.stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {slide.stats.map((st, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl ${theme.cardBg} ${theme.borderColor} border flex flex-col justify-center shadow-md`}
                  >
                    <div className={`text-xl font-black tracking-tight ${theme.accentColor}`}>{st.value}</div>
                    <div className={`text-xs font-bold ${theme.headlineColor}`}>{st.label}</div>
                    {st.subtext && (
                      <div className={`text-[10px] opacity-70 mt-0.5 ${theme.textColor}`}>
                        {st.subtext}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUOTE SLIDE */}
        {slide.type === 'quote' && (
          <div className="space-y-3 text-left">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${theme.accentBg} shadow-md`}>
              <Quote className="w-4 h-4 text-white" />
            </div>
            <p className={`text-lg sm:text-xl font-bold italic leading-snug ${theme.headlineColor}`}>
              "{slide.headline.replace(/^"|"$/g, '')}"
            </p>
            {(slide.quoteAuthor || slide.quoteRole) && (
              <div className="pt-1">
                <div className={`text-xs font-bold ${theme.headlineColor}`}>{slide.quoteAuthor}</div>
                {slide.quoteRole && (
                  <div className={`text-[11px] opacity-75 ${theme.textColor}`}>{slide.quoteRole}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TWEET MOCKUP SLIDE */}
        {slide.type === 'tweet' && (
          <div
            className={`p-4 rounded-2xl ${theme.cardBg} ${theme.borderColor} border space-y-2.5 text-left shadow-lg`}
          >
            <div className="flex items-center gap-2.5">
              <img
                src={brand.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={brand.name}
                className="w-9 h-9 rounded-full object-cover border border-white/20"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1 font-bold text-xs">
                  <span className={theme.headlineColor}>{brand.name}</span>
                  {brand.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />}
                </div>
                <div className={`text-[10px] ${theme.textColor}`}>{brand.handle}</div>
              </div>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${theme.headlineColor}`}>
              {slide.body || slide.headline}
            </p>
          </div>
        )}

        {/* CODE BLOCK SLIDE */}
        {slide.type === 'code' && (
          <div className="space-y-2.5 text-left">
            <h2 className={`text-lg font-bold leading-snug ${theme.headlineColor}`}>
              {slide.headline}
            </h2>
            {slide.codeSnippet && (
              <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3 font-mono text-[11px] text-indigo-300 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[9px] text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-indigo-400" />
                    {slide.codeLanguage || 'typescript'}
                  </span>
                  <span>utf-8</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">{slide.codeSnippet}</pre>
              </div>
            )}
            {slide.body && (
              <p className={`text-xs leading-relaxed opacity-90 ${theme.textColor}`}>{slide.body}</p>
            )}
          </div>
        )}

        {/* CTA SLIDE */}
        {slide.type === 'cta' && (
          <div className="space-y-4 text-center flex flex-col items-center">
            <h2 className={`text-xl sm:text-2xl font-black leading-tight ${theme.headlineColor}`}>
              {slide.headline}
            </h2>
            {slide.subtitle && (
              <p className={`text-xs max-w-xs leading-relaxed ${theme.textColor}`}>
                {slide.subtitle}
              </p>
            )}
            {slide.ctaButtonText && (
              <div
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-lg cursor-pointer ${
                  theme.accentBg
                }`}
              >
                <span>{slide.ctaButtonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER: Brand Kit & Swipe Indicator & Watermark */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          {brand.avatar && (
            <img
              src={brand.avatar}
              alt={brand.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
            />
          )}
          <div className="text-left leading-none">
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className={theme.headlineColor}>{brand.name}</span>
              {brand.isVerified && <CheckCircle2 className="w-2.5 h-2.5 text-sky-400" />}
            </div>
            {brand.handle && (
              <span className={`text-[9px] opacity-75 ${theme.textColor}`}>{brand.handle}</span>
            )}
          </div>
        </div>

        {/* Swipe Prompt or Watermark */}
        <div className="flex items-center gap-2">
          {showSwipeIndicator && slideIndex < totalSlides - 1 && (
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide opacity-80 ${theme.textColor}`}
            >
              Swipe <ChevronRight className="w-3 h-3" />
            </span>
          )}

          {showWatermark && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-white/10">
              ⚡ SlideForge
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
