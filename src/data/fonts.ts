import type { FontOption } from '../types';

export const FONTS: FontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    fontFamily: "'Inter', sans-serif",
    category: 'sans',
    preview: 'Clean & Ultra Modern',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    category: 'sans',
    preview: 'High-Tech SaaS & Polished',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    fontFamily: "'Outfit', sans-serif",
    category: 'sans',
    preview: 'Bold, Punchy & Viral',
  },
  {
    id: 'space',
    name: 'Space Grotesk',
    fontFamily: "'Space Grotesk', sans-serif",
    category: 'display',
    preview: 'Editorial & Brutalist',
  },
  {
    id: 'syne',
    name: 'Syne',
    fontFamily: "'Syne', sans-serif",
    category: 'display',
    preview: 'Avant-Garde & High Fashion',
  },
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    category: 'display',
    preview: 'Expressive & Startup Aesthetic',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    fontFamily: "'Playfair Display', serif",
    category: 'serif',
    preview: 'Sophisticated & Literary',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    fontFamily: "'JetBrains Mono', monospace",
    category: 'mono',
    preview: 'Developer & Technical',
  },
];

export function getFontFamily(fontId?: string): string {
  const found = FONTS.find(f => f.id === fontId);
  return found ? found.fontFamily : "'Plus Jakarta Sans', sans-serif";
}
