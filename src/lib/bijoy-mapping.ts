export const BIJOY_MAPPING: Record<string, { nom: string; shift: string; finger: string }> = {
  // Numbers / Top row
  '`': { nom: '`', shift: '~', finger: 'l-pinky' },
  '1': { nom: '১', shift: '!', finger: 'l-pinky' },
  '2': { nom: '২', shift: '@', finger: 'l-ring' },
  '3': { nom: '৩', shift: '#', finger: 'l-middle' },
  '4': { nom: '৪', shift: '$', finger: 'l-index' },
  '5': { nom: '৫', shift: '%', finger: 'l-index' },
  '6': { nom: '৬', shift: '^', finger: 'r-index' },
  '7': { nom: '৭', shift: 'য়', finger: 'r-index' }, // য় = Shift+7
  '8': { nom: '৮', shift: '*', finger: 'r-middle' },
  '9': { nom: '৯', shift: '(', finger: 'r-ring' },
  '0': { nom: '০', shift: ')', finger: 'r-pinky' },
  '-': { nom: '-', shift: '_', finger: 'r-pinky' },
  '=': { nom: '=', shift: '+', finger: 'r-pinky' },
  
  // QWERTY Row
  'q': { nom: 'ঙ', shift: 'ঁ', finger: 'l-pinky' }, // ঙ=q, ঁ=Shift+Q
  'w': { nom: 'য', shift: 'ব়', finger: 'l-ring' }, // য=w, ব়=Shift+W
  'e': { nom: 'ড', shift: 'ঢ', finger: 'l-middle' }, // ড=e, ঢ=Shift+E
  'r': { nom: 'প', shift: 'ফ', finger: 'l-index' }, // প=r, ফ=Shift+R
  't': { nom: 'ট', shift: 'ঠ', finger: 'l-index' }, // ট=t, ঠ=Shift+T
  'y': { nom: 'চ', shift: 'ছ', finger: 'r-index' }, // চ=y, ছ=Shift+Y
  'u': { nom: 'জ', shift: 'ঝ', finger: 'r-index' }, // জ=u, ঝ=Shift+U
  'i': { nom: 'হ', shift: 'ঞ', finger: 'r-middle' }, // হ=i, ঞ=Shift+I
  'o': { nom: 'গ', shift: 'ঘ', finger: 'r-ring' }, // গ=o, ঘ=Shift+O
  'p': { nom: 'ড়', shift: 'ঢ়', finger: 'r-pinky' }, // ড়=p, ঢ়=Shift+P
  '[': { nom: '[', shift: '{', finger: 'r-pinky' },
  ']': { nom: ']', shift: '}', finger: 'r-pinky' },
  '\\': { nom: 'ৎ', shift: 'ং', finger: 'r-pinky' }, // ৎ=\, ং=Shift+\

  // ASDF Row
  'a': { nom: 'ৃ', shift: 'ঁ', finger: 'l-pinky' }, // ৃ=a, ঁ=Shift+A (from the user's kar list, but q also has ঁ. Let's provide what user said)
  's': { nom: 'ু', shift: 'ূ', finger: 'l-ring' }, // ু=s, ূ=Shift+S
  'd': { nom: 'ি', shift: 'ী', finger: 'l-middle' }, // ি=d, ী=Shift+D
  'f': { nom: 'া', shift: 'অ', finger: 'l-index' }, // া=f, অ=Shift+F
  'g': { nom: 'ং', shift: 'ঁ', finger: 'l-index' }, // ং=g, ঁ=Shift+G (from kar list)
  'h': { nom: 'ব', shift: 'ভ', finger: 'r-index' }, // ব=h, ভ=Shift+H
  'j': { nom: 'ক', shift: 'খ', finger: 'r-index' }, // ক=j, খ=Shift+J
  'k': { nom: 'ত', shift: 'থ', finger: 'r-middle' }, // ত=k, থ=Shift+K
  'l': { nom: 'দ', shift: 'ধ', finger: 'r-ring' }, // দ=l, ধ=Shift+L
  ';': { nom: ';', shift: ':', finger: 'r-pinky' },
  '\'': { nom: '\'', shift: '"', finger: 'r-pinky' },

  // ZXCV Row
  'z': { nom: '্', shift: 'ঃ', finger: 'l-pinky' }, // ্=z, ঃ=Shift+Z
  'x': { nom: 'ো', shift: 'ৌ', finger: 'l-ring' }, // ো=x, ৌ=Shift+X (Wait, user said ও=x, ঔ=Shift+x for swarabarno! But also ো=x, ৌ=Shift+X. Since it's a typing test, both are handled by x. The visual keyboard just shows one, let's show ো/ৌ visually as it is more common)
  'c': { nom: 'ে', shift: 'ৈ', finger: 'l-middle' }, // ে=c, ৈ=Shift+C
  'v': { nom: 'র', shift: 'ল', finger: 'l-index' }, // র=v, ল=Shift+V
  'b': { nom: 'ন', shift: 'ণ', finger: 'l-index' }, // ন=b, ণ=Shift+B
  'n': { nom: 'স', shift: 'ষ', finger: 'r-index' }, // স=n, ষ=Shift+N
  'm': { nom: 'ম', shift: 'শ', finger: 'r-index' }, // ম=m, শ=Shift+M
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
