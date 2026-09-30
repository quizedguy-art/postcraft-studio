import type { Slide } from '../types';

export interface GenerateOptions {
  topic: string;
  tone: 'professional' | 'hype' | 'educational' | 'story' | 'minimal';
  slideCount: number;
  apiKey?: string;
}

/**
 * Generate a complete, high-converting carousel with real Gemini AI or smart copywriting heuristics.
 */
export async function generateCarouselAI(options: GenerateOptions): Promise<Slide[]> {
  const { topic, tone, slideCount, apiKey } = options;
  const cleanTopic = topic.trim() || 'High-Impact Digital Skills & Systems';

  // 1. If user provided a Google Gemini API Key, call Gemini API
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `You are a world-class viral LinkedIn & social media carousel copywriter.
Create an engaging, viral, high-value ${slideCount}-slide carousel deck about: "${cleanTopic}".
Tone: ${tone}.

Format your response strictly as a JSON array of objects with the following TypeScript Slide schema:
[
  {
    "id": "slide-1",
    "type": "cover",
    "tag": "SHORT CATEGORY BADGE",
    "headline": "Magnetic Viral Hook Headline",
    "subtitle": "Clear intriguing subtext explaining why they must swipe",
    "highlightText": "1-3 words to visually emphasize"
  },
  {
    "id": "slide-2",
    "type": "content",
    "tag": "Step 01 // Insight",
    "headline": "First Core Concept",
    "body": "Punchy 1-2 sentence explanation of the mechanism.",
    "bulletPoints": ["Key takeaway bullet 1", "Key takeaway bullet 2", "Key takeaway bullet 3"]
  },
  {
    "id": "slide-3",
    "type": "stats",
    "tag": "The Data",
    "headline": "The Hard Numbers Behind This",
    "subtitle": "Proven measurable results",
    "stats": [
      { "value": "10x", "label": "Output Multiplier", "subtext": "Automated workflow" },
      { "value": "85%", "label": "Higher Engagement", "subtext": "Visual retention" },
      { "value": "14 Days", "label": "Time to Results", "subtext": "Consistent execution" }
    ]
  },
  {
    "id": "slide-4",
    "type": "quote",
    "tag": "Key Axiom",
    "headline": "A memorable, contrarian quote summarizing the golden rule.",
    "quoteAuthor": "Strategic Framework",
    "quoteRole": "Executive Playbook"
  },
  {
    "id": "slide-last",
    "type": "cta",
    "tag": "Take Action",
    "headline": "Ready to execute ${cleanTopic}?",
    "subtitle": "Save this post for reference and follow for more weekly deep-dives.",
    "ctaButtonText": "Bookmark & Repost ⚡"
  }
]
Total slides in array MUST be exactly ${slideCount}.
Ensure slides vary across 'cover', 'content', 'stats', 'quote', and end with a 'cta'.
Output ONLY valid JSON. No surrounding markdown codeblocks.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.replace(/^```json/i, '').replace(/```$/i, '').trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((s, i) => ({
              ...s,
              id: `slide-gemini-${Date.now()}-${i + 1}`,
            }));
          }
        }
      }
    } catch (err) {
      console.warn('Gemini API call encountered an issue, generating via smart fallback engine:', err);
    }
  }

  // 2. High-converting smart generator fallback
  return generateCarouselFromTopic(options);
}

export const generateCarouselFromTopic = (options: GenerateOptions): Slide[] => {
  const { topic, tone, slideCount } = options;
  const cleanTopic = topic.trim() || 'Building High-Yield Digital Assets';
  const slides: Slide[] = [];

  // Tag prefixes based on tone
  const coverTags: Record<string, string> = {
    hype: '🔥 UNTOLD BLUEPRINT',
    story: '📖 REAL CASE STUDY',
    professional: '📊 EXECUTIVE BRIEF',
    educational: '💡 MASTERCLASS GUIDE',
    minimal: '⚡ ESSENTIAL AXIOM',
  };

  // 1. Cover
  slides.push({
    id: `slide-${Date.now()}-1`,
    type: 'cover',
    tag: coverTags[tone] || '💡 CRITICAL GUIDE',
    headline: `The Ultimate Framework to ${cleanTopic}`,
    subtitle: tone === 'hype'
      ? 'Stop wasting months on low-leverage tactics. Here is the exact system that wins in 2026.'
      : 'A concise, actionable breakdown you can execute in less than 30 minutes.',
    highlightText: cleanTopic.split(' ').slice(0, 3).join(' '),
    alignment: 'left',
  });

  // 2. Core Problem & Mindset
  slides.push({
    id: `slide-${Date.now()}-2`,
    type: 'content',
    tag: 'Phase 01 // The Problem',
    headline: `Why Most Fail When Approaching ${cleanTopic.split(' ')[0] || 'This'}`,
    body: 'Most people overcomplicate the mechanics and neglect high-leverage clarity. When you eliminate friction, results compound automatically.',
    bulletPoints: [
      'Focusing on 10 fragmented tasks instead of 1 high-impact bottleneck',
      'Failing to validate real buyer demand before spending 40+ hours creating',
      'Packaging value into repeatable, frictionless digital systems'
    ],
  });

  // 3. Stats / Metrics
  if (slideCount >= 3) {
    slides.push({
      id: `slide-${Date.now()}-3`,
      type: 'stats',
      tag: 'Phase 02 // The Metrics',
      headline: `The Numbers Behind Compounding Growth`,
      subtitle: 'Track only the few key indicators that truly drive leverage.',
      stats: [
        { value: '10x', label: 'Faster Execution', subtext: 'Systemized workflows' },
        { value: '88%', label: 'Higher Conversion', subtext: 'Clear visual positioning' },
        { value: '100%', label: 'Repeatable', subtext: 'Asset-driven approach' },
      ],
    });
  }

  // 4. Strategic Principle / Quote
  if (slideCount >= 4) {
    slides.push({
      id: `slide-${Date.now()}-4`,
      type: 'quote',
      tag: 'Phase 03 // Core Law',
      headline: `"Complexity is the enemy of execution. When your offer is unmistakable, buying decisions become inevitable."`,
      quoteAuthor: 'Proven Growth Axiom',
      quoteRole: 'Strategy Playbook',
    });
  }

  // 5. Tactical Action Items
  if (slideCount >= 5) {
    slides.push({
      id: `slide-${Date.now()}-5`,
      type: 'content',
      tag: 'Phase 04 // Action Plan',
      headline: `3 Immediate Next Steps to Take Today`,
      body: 'Do not just consume this information—apply it immediately in your daily workflow:',
      bulletPoints: [
        'Audit your current pipeline and eliminate the 2 biggest time-wasters',
        'Package your core strength into a single clear outcome',
        'Distribute consistently across high-retention visual formats'
      ],
    });
  }

  // Final CTA
  slides.push({
    id: `slide-${Date.now()}-last`,
    type: 'cta',
    tag: 'Take Action',
    headline: `Ready to master ${cleanTopic}?`,
    subtitle: 'Save this post for later and follow for weekly tactical deep-dives.',
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
