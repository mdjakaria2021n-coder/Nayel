export const BIJOY_MAP: Record<string, string[]> = {
  // স্বরবর্ণ
  'অ': ['Shift+F'],
  'আ': ['G', 'F'],
  'ই': ['G', 'D'],
  'ঈ': ['G', 'Shift+D'],
  'উ': ['G', 'S'],
  'ঊ': ['G', 'Shift+S'],
  'ঋ': ['G', 'A'],
  'এ': ['G', 'C'],
  'ঐ': ['G', 'Shift+C'],
  'ও': ['X'],
  'ঔ': ['G', 'Shift+X'],

  // কার
  'া': ['F'],
  'ি': ['D'],
  'ী': ['Shift+D'],
  'ু': ['S'],
  'ূ': ['Shift+S'],
  'ৃ': ['A'],
  'ে': ['C'],
  'ৈ': ['Shift+C'],
  'ো': ['F', 'C'],
  'ৌ': ['F', 'Shift+C'],
  'ঁ': ['Shift+A'],
  'ং': ['G'],
  'ঃ': ['Shift+Z'],
  '্': ['Z'],

  // ব্যঞ্জনবর্ণ
  'ক': ['J'],
  'খ': ['Shift+J'],
  'গ': ['O'],
  'ঘ': ['Shift+O'],
  'ঙ': ['Q'],
  'চ': ['Y'],
  'ছ': ['Shift+Y'],
  'জ': ['U'],
  'ঝ': ['Shift+U'],
  'ঞ': ['Shift+I'],
  'ট': ['T'],
  'ঠ': ['Shift+T'],
  'ড': ['E'],
  'ঢ': ['Shift+E'],
  'ণ': ['Shift+B'],
  'ত': ['K'],
  'থ': ['Shift+K'],
  'দ': ['L'],
  'ধ': ['Shift+L'],
  'ন': ['B'],
  'প': ['R'],
  'ফ': ['Shift+R'],
  'ব': ['H'],
  'ভ': ['Shift+H'],
  'ম': ['M'],
  'য': ['Shift+W'],
  'য়': ['W'],
  'র': ['V'],
  'ল': ['Shift+V'],
  'শ': ['Shift+M'],
  'ষ': ['Shift+N'],
  'স': ['N'],
  'হ': ['I'],

  // Unicode variants
  'ড়': ['P'], // U+09DC
  'ড়': ['P'], // U+09A1 U+09BC (fallback)
  'ঢ়': ['Shift+P'], // U+09DD
  'ঢ়': ['Shift+P'], // U+09A2 U+09BC (fallback)
  'য়': ['W'], // U+09DF
  'য়': ['W'], // U+09AF U+09BC (fallback)
  
  'ৎ': ['\\'],
};

export function getWordKeysArray(word: string): string[] {
  const result: string[] = [];
  for (const char of [...word]) {
    if (BIJOY_MAP[char]) {
      result.push(...BIJOY_MAP[char]);
    } else {
      result.push(char === ' ' ? 'Space' : char);
    }
  }
  return result;
}

export function getWordKeys(word: string): string {
  return getWordKeysArray(word).join(' → ');
}

export const BIJOY_MAPPING: Record<string, { nom: string; shift: string; finger: string }> = {
  // Numbers / Top row
  '`': { nom: '`', shift: '~', finger: 'l-pinky' },
  '1': { nom: '১', shift: '!', finger: 'l-pinky' },
  '2': { nom: '২', shift: '@', finger: 'l-ring' },
  '3': { nom: '৩', shift: '#', finger: 'l-middle' },
  '4': { nom: '৪', shift: '$', finger: 'l-index' },
  '5': { nom: '৫', shift: '%', finger: 'l-index' },
  '6': { nom: '৬', shift: '^', finger: 'r-index' },
  '7': { nom: '৭', shift: '&', finger: 'r-index' },
  '8': { nom: '৮', shift: '*', finger: 'r-middle' },
  '9': { nom: '৯', shift: '(', finger: 'r-ring' },
  '0': { nom: '০', shift: ')', finger: 'r-pinky' },
  '-': { nom: '-', shift: '_', finger: 'r-pinky' },
  '=': { nom: '=', shift: '+', finger: 'r-pinky' },
  
  // QWERTY Row
  'q': { nom: 'ঙ', shift: '', finger: 'l-pinky' },
  'w': { nom: 'য়', shift: 'য', finger: 'l-ring' },
  'e': { nom: 'ড', shift: 'ঢ', finger: 'l-middle' },
  'r': { nom: 'প', shift: 'ফ', finger: 'l-index' },
  't': { nom: 'ট', shift: 'ঠ', finger: 'l-index' },
  'y': { nom: 'চ', shift: 'ছ', finger: 'r-index' },
  'u': { nom: 'জ', shift: 'ঝ', finger: 'r-index' },
  'i': { nom: 'হ', shift: 'ঞ', finger: 'r-middle' },
  'o': { nom: 'গ', shift: 'ঘ', finger: 'r-ring' },
  'p': { nom: 'ড়', shift: 'ঢ়', finger: 'r-pinky' },
  '[': { nom: '[', shift: '{', finger: 'r-pinky' },
  ']': { nom: ']', shift: '}', finger: 'r-pinky' },
  '\\': { nom: 'ৎ', shift: '|', finger: 'r-pinky' },

  // ASDF Row
  'a': { nom: 'ৃ', shift: 'ঁ', finger: 'l-pinky' },
  's': { nom: 'ু', shift: 'ূ', finger: 'l-ring' },
  'd': { nom: 'ি', shift: 'ী', finger: 'l-middle' },
  'f': { nom: 'া', shift: 'অ', finger: 'l-index' },
  'g': { nom: 'ং', shift: '', finger: 'l-index' },
  'h': { nom: 'ব', shift: 'ভ', finger: 'r-index' },
  'j': { nom: 'ক', shift: 'খ', finger: 'r-index' },
  'k': { nom: 'ত', shift: 'থ', finger: 'r-middle' },
  'l': { nom: 'দ', shift: 'ধ', finger: 'r-ring' },
  ';': { nom: ';', shift: ':', finger: 'r-pinky' },
  '\'': { nom: '\'', shift: '"', finger: 'r-pinky' },

  // ZXCV Row
  'z': { nom: '্', shift: 'ঃ', finger: 'l-pinky' },
  'x': { nom: 'ও/ো', shift: 'ৌ', finger: 'l-ring' },
  'c': { nom: 'ে', shift: 'ৈ', finger: 'l-middle' },
  'v': { nom: 'র', shift: 'ল', finger: 'l-index' },
  'b': { nom: 'ন', shift: 'ণ', finger: 'l-index' },
  'n': { nom: 'স', shift: 'ষ', finger: 'r-index' },
  'm': { nom: 'ম', shift: 'শ', finger: 'r-index' },
  ',': { nom: ',', shift: '<', finger: 'r-middle' },
  '.': { nom: '.', shift: '>', finger: 'r-ring' },
  '/': { nom: '/', shift: '?', finger: 'r-pinky' },

  // Space
  ' ': { nom: 'Space', shift: 'Space', finger: 'thumb' }
};

export const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
  ['Shift_L', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift_R'],
  ['Space']
];
