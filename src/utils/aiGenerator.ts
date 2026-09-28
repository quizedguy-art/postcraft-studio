import type { Slide } from '../types';

export interface GenerateOptions {
  topic: string;
  tone: 'professional' | 'hype' | 'educational' | 'story' | 'minimal';
  slideCount: number;
  includeStats?: boolean;
}

export const generateCarouselFromTopic = (options: GenerateOptions): Slide[] => {
  const { topic, tone, slideCount, includeStats } = options;
  const cleanTopic = topic.trim() || 'Building High-Yield Digital Assets';

  const slides: Slide[] = [];

  // 1. Cover Slide
  slides.push({
    id: `slide-${Date.now()}-1`,
    type: 'cover',
    tag: tone === 'hype' ? '🔥 UNTOLD BLUEPRINT' : tone === 'story' ? '📖 REAL CASE STUDY' : '💡 CRITICAL GUIDE',
    headline: `The Step-by-Step Blueprint to ${cleanTopic}`,
    subtitle: tone === 'hype' 
      ? 'Stop wasting months on low-leverage tactics. Here is what separates the top 1%.'
      : 'A concise, actionable framework you can execute in less than 30 minutes.',
    highlightText: cleanTopic,
    alignment: 'left',
  });

  // 2. Core Problem / Mindset Shift
  slides.push({
    id: `slide-${Date.now()}-2`,
    type: 'content',
    tag: 'Step 01 // The Foundation',
    headline: `Why 90% Fail at ${cleanTopic.split(' ')[0] || 'Execution'}`,
    body: 'Most creators and founders focus on complexity instead of high-leverage clarity. When you eliminate friction, velocity explodes.',
    bulletPoints: [
      'Focus on one clear outcome instead of ten distractions',
      'Validate buyer demand before spending 100 hours creating',
      'Package your solution into a dead-simple repeatable asset'
    ],
  });

  // 3. Stats or Deep Dive Slide
  if (includeStats || slideCount >= 4) {
    slides.push({
      id: `slide-${Date.now()}-3`,
      type: 'stats',
      tag: 'Step 02 // The Numbers',
      headline: `The Velocity Math Behind Scalable Results`,
      subtitle: 'Tracking the few metrics that actually move the needle.',
      stats: [
        { value: '10x', label: 'Faster Output', subtext: 'Automated workflows' },
        { value: '85%', label: 'Retention Boost', subtext: 'Visual storytelling' },
        { value: '$100+', label: 'Weekly Return', subtext: 'Consistent compound growth' },
      ],
    });
  }

  // 4. Tactical Breakdown
  if (slideCount >= 5) {
    slides.push({
      id: `slide-${Date.now()}-4`,
      type: 'quote',
      tag: 'Step 03 // Core Axiom',
      headline: `"Simplicity is the ultimate sophistication. When you make the value obvious, conversion becomes effortless."`,
      quoteAuthor: 'Proven Industry Rule',
      quoteRole: 'Strategy Playbook',
    });
  }

  // 5. Final CTA Slide
  slides.push({
    id: `slide-${Date.now()}-last`,
    type: 'cta',
    tag: 'Take Action',
    headline: `Ready to master ${cleanTopic}?`,
    subtitle: 'Save this post for reference and follow for more weekly deep-dives.',
    ctaButtonText: 'Bookmark & Follow ⚡',
  });

  return slides;
};

export const parseMarkdownToCarousel = (markdown: string): Slide[] => {
  const blocks = markdown.split(/\n(?=#{1,3}\s+|---|\n\n(?=[A-Z0-9]))/g).filter(b => b.trim().length > 0);
  
  if (blocks.length === 0) {
    return generateCarouselFromTopic({
      topic: 'High-Converting Digital Growth',
      tone: 'educational',
      slideCount: 4,
    });
  }

  return blocks.map((block, idx) => {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0] || '';
    const headline = firstLine.replace(/^#{1,4}\s*/, '').replace(/^\d+\.\s*/, '') || `Key Insight #${idx + 1}`;
    const rest = lines.slice(1);

    const bulletPoints = rest
      .filter(l => l.startsWith('-') || l.startsWith('*') || /^\d+\./.test(l))
      .map(l => l.replace(/^[-*]\s*|\d+\.\s*/, ''));

    const bodyParagraphs = rest
      .filter(l => !l.startsWith('-') && !l.startsWith('*') && !/^\d+\./.test(l))
      .join('\n\n');

    let type: Slide['type'] = 'content';
    if (idx === 0) type = 'cover';
    else if (idx === blocks.length - 1) type = 'cta';
    else if (firstLine.includes('“') || firstLine.includes('"') || block.includes('Quote:')) type = 'quote';
    else if (bulletPoints.length >= 2) type = 'content';

    return {
      id: `slide-parsed-${Date.now()}-${idx}`,
      type,
      tag: idx === 0 ? '✨ Quick Read' : `Point 0${idx}`,
      headline,
      body: bodyParagraphs || undefined,
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
      ctaButtonText: type === 'cta' ? 'Share & Repost 🔁' : undefined,
    };
  });
};
