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
        subtitle: 'Most founders fail because they build before they distribute. Here is what actually works.',
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
          'Audit who has the budget before writing code',
          'B2B always converts 5x faster than B2C',
          'If no competitor exists, demand might not exist either'
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
        body: 'The worst product with great distribution will always crush the best product nobody has ever heard of.\n\nSpend 50% of your time building, and 50% building audience in public.',
        quoteAuthor: 'Alex Hormozi / Indie Principle',
      },
      {
        id: 's5',
        type: 'cta',
        tag: 'Next Steps',
        headline: 'Want the full step-by-step launch checklist?',
        subtitle: 'Swipe down or check the link in the comments for my free Notion operating system.',
        ctaButtonText: 'Get the Free Checklist ⚡',
        ctaButtonLink: 'slideforge.io/checklist',
      },
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
