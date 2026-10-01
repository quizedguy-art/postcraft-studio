import type { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'solopreneur-truths',
    title: '7 Brutal Truths About Building Micro-SaaS',
    description: 'High-performing hook with numbered takeaways and punchy insights.',
    category: 'growth',
    badge: 'Viral Hook',
    slides: [
      {
        id: 's1',
        type: 'cover',
        tag: '🚀 Micro-SaaS Blueprint',
        headline: '7 Hard Truths About Making Your First $1,000 Online',
        subtitle: 'Most founders fail because they build before they distribute. Here is what actually works in 2026.',
        highlightText: '$1,000 Online',
        alignment: 'left',
      },
      {
        id: 's2',
        type: 'content',
        tag: 'Rule #1',
        headline: 'Solve An Expensive Pain, Not An Interesting Idea',
        body: 'People don’t pay for "nice-to-have" widgets. They pay to make more money, save 5 hours a week, or avoid looking foolish to their boss.',
        bulletPoints: [
          'Audit who has the budget before writing a single line of code',
          'B2B always converts 5x faster with higher willingness to pay',
          'If no competitor exists, buyer demand might not exist either'
        ],
      },
      {
        id: 's3',
        type: 'stats',
        tag: 'Metric Focus',
        headline: 'The $100/Week Math That Changed My Mindset',
        subtitle: 'You do not need 10,000 users. You just need 35 loyal champions.',
        stats: [
          { value: '35', label: 'Active Subscribers', subtext: 'Paying $12/month' },
          { value: '$420', label: 'Monthly Recurring', subtext: '=$105 every week' },
          { value: '94%', label: 'Gross Margin', subtext: 'Pure digital leverage' },
        ],
      },
      {
        id: 's4',
        type: 'tweet',
        tag: 'Mindset Shift',
        headline: 'Distribution Beats Product Quality Every Single Time',
        body: 'The worst product with great distribution will always crush the best product nobody has ever heard of.\n\nSpend 50% of your time building, and 50% building your distribution engine in public.',
        quoteAuthor: 'Indie Creator Rule',
      },
      {
        id: 's5',
        type: 'cta',
        tag: 'Next Steps',
        headline: 'Want the full step-by-step launch checklist?',
        subtitle: 'Save this post for later and follow for weekly tactical breakdowns.',
        ctaButtonText: 'Get the Free Checklist ⚡',
        ctaButtonLink: 'slideforge.io/checklist',
      },
    ],
  },
  {
    id: 'weekly-revenue-roadmap',
    title: 'The $100/Week Solopreneur Growth Engine',
    description: 'A realistic tactical guide to turning high-retention visual posts into paying customers.',
    category: 'growth',
    badge: 'Revenue',
    slides: [
      {
        id: 'r1',
        type: 'cover',
        tag: '💰 Cashflow Playbook',
        headline: 'How To Generate $100/Week From Niche Digital Tools',
        subtitle: 'No complex pitch decks or VC capital. Just dead-simple utility products solving clear problems.',
      },
      {
        id: 'r2',
        type: 'content',
        tag: 'Step 01 // The Offer',
        headline: 'Create a Single-Feature "No-Brainer" Tool',
        body: 'Large multi-feature suites overwhelm users. Focus entirely on one high-frequency bottleneck:',
        bulletPoints: [
          'Social carousel & deck exporter (SlideForge model)',
          'AI transcript cleaner or prompt rewriter',
          'Automated invoice & receipt generator for freelancers'
        ],
      },
      {
        id: 'r3',
        type: 'stats',
        tag: 'The Math',
        headline: 'Two Proven Paths to $400 - $500/Month',
        stats: [
          { value: '17', label: 'Monthly Subs', subtext: '@ $5.99/mo (₹499)' },
          { value: '4', label: 'Founder Sales/Wk', subtext: '@ $29 One-Time' },
          { value: '100%', label: 'Direct to Bank', subtext: 'via Lemon Squeezy' },
        ],
      },
      {
        id: 'r4',
        type: 'content',
        tag: 'Step 02 // Distribution',
        headline: 'Turn Every Export Into Free Marketing',
        body: 'Embed a subtle brand badge on free exports. When your users share their carousels on LinkedIn, their audience sees your tool and signs up automatically.',
      },
      {
        id: 'r5',
        type: 'cta',
        tag: 'Take Action',
        headline: 'Ready to build your first profitable micro-asset?',
        subtitle: 'Bookmark this post and start creating visual decks in seconds.',
        ctaButtonText: 'Start Creating Free 🚀',
      }
    ],
  },
  {
    id: 'tech-architecture',
    title: 'Modern Full-Stack SaaS Architecture in 2026',
    description: 'Technical breakdown showing stack choices, performance metrics, and diagrams.',
    category: 'tech',
    badge: 'Dev Favorite',
    slides: [
      {
        id: 't1',
        type: 'cover',
        tag: '⚡ Tech Stack 2026',
        headline: 'How I Built & Deployed A $500/Mo App in 48 Hours',
        subtitle: 'Zero complex Kubernetes. Pure speed, modern TypeScript, and edge-rendered simplicity.',
      },
      {
        id: 't2',
        type: 'code',
        tag: 'The Edge Engine',
        headline: 'Client-Side Canvas Rendering Over Heavy GPU Servers',
        codeSnippet: `// Zero server bills: Render 100% on client
export const exportSlideToPng = async (node) => {
  const dataUrl = await htmlToImage.toPng(node, {
    pixelRatio: 2, // Ultra HD Retina
    cacheBust: true,
  });
  return dataUrl;
};`,
        codeLanguage: 'typescript',
        body: 'By offloading heavy rendering to the client browser, our operational server costs remain practically $0.00/month.',
      },
      {
        id: 't3',
        type: 'stats',
        tag: 'Infrastructure',
        headline: 'Our Total Monthly Cloud Infrastructure Costs',
        stats: [
          { value: '$0.00', label: 'Vercel / Netlify Edge', subtext: 'Free tier limits' },
          { value: '$0.00', label: 'Supabase / SQLite', subtext: 'Database tier' },
          { value: '$12.00', label: 'Domain & Email', subtext: 'Annualized' },
        ],
      },
      {
        id: 't4',
        type: 'cta',
        tag: 'Source Code',
        headline: 'Star the GitHub Repo & Clone the Template',
        subtitle: 'Everything is open-source and ready to deploy with one click.',
        ctaButtonText: 'Clone on GitHub ⭐',
      }
    ],
  },
  {
    id: 'framework-copywriting',
    title: '5 Copywriting Frameworks That Make High Conversions',
    description: 'Framework cards that explain PAS, AIDA, and Hook-Story-Offer structures.',
    category: 'growth',
    badge: 'Marketing',
    slides: [
      {
        id: 'c1',
        type: 'cover',
        tag: '🧠 Conversion Psychology',
        headline: '5 Copywriting Formulas That Turn Solopreneurs Into Super-Creators',
        subtitle: 'Steal these battle-tested psychological frameworks for your landing pages and carousels.',
      },
      {
        id: 'c2',
        type: 'content',
        tag: 'Framework #1',
        headline: 'The PAS Formula (Problem - Agitation - Solution)',
        body: '1. Problem: State the annoying obstacle your reader is currently facing.\n2. Agitate: Describe the emotional cost of leaving it unsolved.\n3. Solution: Present your tool as the painless cure.',
      },
      {
        id: 'c3',
        type: 'quote',
        tag: 'Golden Principle',
        headline: 'People do not buy products. They buy better versions of themselves.',
        quoteAuthor: 'Steve Jobs',
        quoteRole: 'Co-founder, Apple',
      },
      {
        id: 'c4',
        type: 'cta',
        tag: 'Free Templates',
        headline: 'Save this post for your next launch campaign',
        subtitle: 'Hit the Repost button 🔁 to share this value with fellow creators.',
        ctaButtonText: 'Bookmark & Share 🔖',
      },
    ],
  },
];
