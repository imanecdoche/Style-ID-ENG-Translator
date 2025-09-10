
import type { TranslationStyle } from './types';

export const PREDEFINED_STYLES: TranslationStyle[] = [
  { id: 'formal-british', name: 'Formal British', description: 'Polite, precise, and sophisticated English as used in formal UK contexts. Uses words like "shall", "whilst", and proper titles.' },
  { id: 'formal-american', name: 'Formal American', description: 'Standard, professional English suitable for business and academic settings in the US. Direct and clear language.' },
  { id: 'slang-british', name: 'Slang (British)', description: 'Informal, colloquial British English. Includes modern slang like "chuffed", "gutted", "brilliant".' },
  { id: 'slang-american', name: 'Slang (American)', description: 'Casual, contemporary American English with common slang terms like "lit", "dope", "no cap".' },
  { id: 'shakespearean', name: 'Shakespearean', description: 'In the style of William Shakespeare, using archaic language like "thee", "thou", and dramatic flair.' },
  { id: 'gen-z-lingo', name: 'Gen Z Lingo', description: 'Modern internet slang used by Generation Z. Informal, meme-heavy, uses terms like "bet", "slay", "it\'s giving".' }
];
