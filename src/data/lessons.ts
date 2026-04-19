export interface Lesson {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Exam';
  description: string;
  words: { keys: string; bangla: string }[];
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'লিসন ১: হোম রো (সাধারণ অক্ষর)',
    level: 'Beginner',
    description: 'ভিজ্যুয়াল কীবোর্ড দেখে ক, ত, দ, ব, ম, া, ি, ু অক্ষরগুলো বারবার টাইপ করে আঙুল সেট করুন।',
    words: [
      { keys: 'jjj', bangla: 'ককক' }, { keys: 'kkk', bangla: 'ততত' }, { keys: 'lll', bangla: 'দদদ' },
      { keys: 'hhh', bangla: 'ববব' }, { keys: ';;;', bangla: 'মমম' }, { keys: 'fff', bangla: 'াাা' },
      { keys: 'ddd', bangla: 'িিি' }, { keys: 'sss', bangla: 'ুুু' },
      { keys: 'jfj', bangla: 'কাক' }, { keys: 'kfk', bangla: 'তাত' }, { keys: 'ldl', bangla: 'দাদ' },
      { keys: 'hfh', bangla: 'বাব' }, { keys: ';f;', bangla: 'মাম' }, { keys: 'jdj', bangla: 'কিক' },
      { keys: 'kdk', bangla: 'তিত' }, { keys: 'jsj', bangla: 'কুক' }, { keys: 'ksk', bangla: 'তুত' },
      { keys: 'jjk', bangla: 'ককত' }, { keys: 'kkl', bangla: 'ততদ' }, { keys: 'hh;', bangla: 'ববম' },
      { keys: 'jjjj', bangla: 'কককক' }, { keys: 'kkkk', bangla: 'তততত' }, { keys: 'llll', bangla: 'দদদদ' },
      { keys: 'hhhh', bangla: 'বববব' }, { keys: ';;;;', bangla: 'মমমম' }
    ]
  },
  {
    id: 2,
    title: 'লিসন ২: হোম রো (Shift - খ, থ, ধ, ভ, শ)',
    level: 'Beginner',
    description: 'Shift চেপে ধরে খ, থ, ধ, ভ, শ এবং ী, ূ বারবার প্র্যাকটিস করুন যেন মুখস্থ হয়ে যায়।',
    words: [
      { keys: 'JJJ', bangla: 'খখখ' }, { keys: 'KKK', bangla: 'থথথ' }, { keys: 'LLL', bangla: 'ধধধ' },
      { keys: 'HHH', bangla: 'ভভভ' }, { keys: ':::', bangla: 'শশশ' }, { keys: 'FFF', bangla: 'অঅঅ' },
      { keys: 'DDD', bangla: 'ীীী' }, { keys: 'SSS', bangla: 'ূূূ' },
      { keys: 'JFJ', bangla: 'খঅখ' }, { keys: 'KFK', bangla: 'থঅথ' }, { keys: 'LFL', bangla: 'ধঅধ' },
      { keys: 'HFH', bangla: 'ভঅভ' }, { keys: ':F:', bangla: 'শঅশ' }, { keys: 'JDJ', bangla: 'খীখ' },
      { keys: 'KDK', bangla: 'থীথ' }, { keys: 'LDL', bangla: 'ধীধ' }, { keys: 'JjJ', bangla: 'খকখ' },
      { keys: 'KkK', bangla: 'থতথ' }, { keys: 'LlL', bangla: 'ধদধ' }, { keys: 'HhH', bangla: 'ভবভ' },
      { keys: 'J J K K L L', bangla: 'খ খ থ থ ধ ধ' }, { keys: 'H H : : F F', bangla: 'ভ ভ শ শ অ অ' }
    ]
  },
  {
    id: 3,
    title: 'লিসন ৩: টপ রো (সাধারণ অক্ষর)',
    level: 'Intermediate',
    description: 'চ, জ, প, ট, ড, গ বারবার মুখস্থ করার জন্য এই লিসন।',
    words: [
      { keys: 'yyy', bangla: 'চচচ' }, { keys: 'uuu', bangla: 'জজজ' }, { keys: 'rrr', bangla: 'পপপ' },
      { keys: 'ttt', bangla: 'টটট' }, { keys: 'eee', bangla: 'ডডড' }, { keys: 'ooo', bangla: 'গগগ' },
      { keys: 'iii', bangla: 'হহহ' }, { keys: 'qqq', bangla: 'ঙঙঙ' },
      { keys: 'yfy', bangla: 'চাচ' }, { keys: 'ufu', bangla: 'জাজ' }, { keys: 'rfr', bangla: 'পাপ' },
      { keys: 'tft', bangla: 'টাট' }, { keys: 'efe', bangla: 'ডাড' }, { keys: 'ofo', bangla: 'গাগ' },
      { keys: 'yuy', bangla: 'চজচ' }, { keys: 'rtr', bangla: 'পটপ' }, { keys: 'eoe', bangla: 'ডগড' },
      { keys: 'yyyy uuuu', bangla: 'চচচচ জজজজ' }, { keys: 'rrrr tttt', bangla: 'পপপপ টটটট' }
    ]
  },
  {
    id: 4,
    title: 'লিসন ৪: টপ রো (Shift - ছ, ঝ, ফ, ঠ, ঢ, ঘ)',
    level: 'Intermediate',
    description: 'Shift চেপে ছ, ঝ, ফ, ঠ, ঢ, ঘ বেশি করে টাইপ করুন।',
    words: [
      { keys: 'YYY', bangla: 'ছছছ' }, { keys: 'UUU', bangla: 'ঝঝঝ' }, { keys: 'RRR', bangla: 'ফফফ' },
      { keys: 'TTT', bangla: 'ঠঠঠ' }, { keys: 'EEE', bangla: 'ঢঢঢ' }, { keys: 'OOO', bangla: 'ঘঘঘ' },
      { keys: 'III', bangla: 'ঞঞঞ' }, { keys: 'WWW', bangla: 'য়য়য়' },
      { keys: 'YFY', bangla: 'ছঅছ' }, { keys: 'UFU', bangla: 'ঝঅঝ' }, { keys: 'RFR', bangla: 'ফঅফ' },
      { keys: 'TFT', bangla: 'ঠঅঠ' }, { keys: 'EFE', bangla: 'ঢঅঢ' }, { keys: 'OFO', bangla: 'ঘঅঘ' },
      { keys: 'YyY', bangla: 'ছচছ' }, { keys: 'UuU', bangla: 'ঝজঝ' }, { keys: 'RrR', bangla: 'ফপফ' },
      { keys: 'TtT', bangla: 'ঠটঠ' }, { keys: 'EeE', bangla: 'ঢডঢ' }, { keys: 'OoO', bangla: 'ঘগঘ' }
    ]
  },
  {
    id: 5,
    title: 'লিসন ৫: বটম রো (সাধারণ অক্ষর)',
    level: 'Intermediate',
    description: 'র, ন, স, ল, এ, ও টাইপ করে আঙুল বসান ও সময় নিয়ে শিখুন।',
    words: [
      { keys: 'vvv', bangla: 'ররর' }, { keys: 'bbb', bangla: 'ননন' }, { keys: 'nnn', bangla: 'সসস' },
      { keys: 'mmm', bangla: 'ললল' }, { keys: 'ccc', bangla: 'এএএ' }, { keys: 'xxx', bangla: 'ওওও' },
      { keys: 'vfv', bangla: 'রার' }, { keys: 'bfb', bangla: 'নান' }, { keys: 'nfn', bangla: 'সাস' },
      { keys: 'mfm', bangla: 'লাল' }, { keys: 'cvc', bangla: 'এরএ' }, { keys: 'xbx', bangla: 'ওনও' },
      { keys: 'vbvb', bangla: 'রনরন' }, { keys: 'nmnm', bangla: 'সলসল' }, { keys: 'cxcx', bangla: 'এওএও' },
      { keys: 'vvbbnnmm', bangla: 'ররন্ননসসলল' }
    ]
  },
  {
    id: 6,
    title: 'লিসন ৬: বটম রো (Shift - ণ, ষ, ঐ, ৗ, ং)',
    level: 'Advanced',
    description: 'Shift চেপে ণ, ষ, ঐ, ৗ, ং ইত্যাদি প্র্যাকটিস।',
    words: [
      { keys: 'BBB', bangla: 'ণণণ' }, { keys: 'NNN', bangla: 'ষষষ' }, { keys: 'CCC', bangla: 'ঐঐঐ' },
      { keys: 'XXX', bangla: 'ৗৗৗ' }, { keys: 'MMM', bangla: 'ংংং' },
      { keys: 'BFB', bangla: 'ণঅণ' }, { keys: 'NFN', bangla: 'ষঅষ' },
      { keys: 'BbB', bangla: 'ণনণ' }, { keys: 'NnN', bangla: 'ষসষ' }, { keys: 'CcC', bangla: 'ঐএঐ' },
      { keys: 'BBNN', bangla: 'ণণষষ' }, { keys: 'CCXX', bangla: 'ঐঐৗৗ' }
    ]
  },
  {
    id: 7,
    title: 'লিসন ৭: শিফট মিক্সড প্র্যাকটিস',
    level: 'Advanced',
    description: 'খ, থ, ঘ, ছ এবং অন্যান্য শিফট লেটার মিলে গঠিত প্র্যাকটিস।',
    words: [
      { keys: 'JFY', bangla: 'খঅছ' }, { keys: 'KFU', bangla: 'থঅঝ' }, { keys: 'LFR', bangla: 'ধঅফ' },
      { keys: 'HFT', bangla: 'ভঅঠ' }, { keys: ':FE', bangla: 'শঅঢ' }, { keys: 'DDO', bangla: 'ীীঘ' },
      { keys: 'SSB', bangla: 'ূূণ' }, { keys: 'AAN', bangla: 'র্র্ষ' }, { keys: 'KFM', bangla: 'থঅং' },
      { keys: 'Jj Yy Rr', bangla: 'খক ছচ ফপ' }, { keys: 'Ll Ee Nn', bangla: 'ধদ ঢড ষস' },
      { keys: 'Kk Tt Bb', bangla: 'থত ঠট ণন' }
    ]
  },
  {
    id: 8,
    title: 'লিসন ৮: সাধারণ শব্দ গঠন',
    level: 'Advanced',
    description: 'যে অক্ষরগুলো শিখেছেন তা দিয়ে ছোট ছোট বাংলা শব্দ।',
    words: [
      { keys: 'jfj', bangla: 'কাক' }, { keys: 'kfk', bangla: 'তাত' }, { keys: 'jfd', bangla: 'কাকি' },
      { keys: 'kfv', bangla: 'তার' }, { keys: 'hfd', bangla: 'বাবি' }, { keys: 'vdv', bangla: 'রির' },
      { keys: 'jvd', bangla: 'করি' }, { keys: 'bvf', bangla: 'নরা' }, { keys: 'hvM', bangla: 'বরং' },
      { keys: 'cl', bangla: 'এদ' }, { keys: 'cv', bangla: 'এর' }, { keys: 'vf', bangla: 'রা' },
      { keys: 'yfd', bangla: 'চাহি' }, { keys: 'nkv', bangla: 'সতর' }, { keys: 'mjv', bangla: 'লকর' }
    ]
  },
  {
    id: 9,
    title: 'লিসন ৯: শিফট-সহ শব্দ গঠন',
    level: 'Exam',
    description: 'বড় ও শিফটযুক্ত শব্দের টানা প্র্যাকটিস যা আপনার স্পিড বাড়াবে।',
    words: [
      { keys: 'Jfvf', bangla: 'খারা' }, { keys: 'Ofn', bangla: 'ঘাস' }, { keys: 'Yfp', bangla: 'ছাড়' },
      { keys: 'Uvp', bangla: 'ঝরড়' }, { keys: 'Kfv', bangla: 'থার' }, { keys: 'Rjf', bangla: 'ফকা' },
      { keys: 'Tfc', bangla: 'ঠাএ' }, { keys: 'Lgb', bangla: 'ধ্ন' }, { keys: 'Hvf', bangla: 'ভরা' },
      { keys: ':vf', bangla: 'শরা' }, { keys: 'Yf:', bangla: 'ছাশ' }, { keys: 'Ovf', bangla: 'ঘরা' }
    ]
  },
  {
    id: 10,
    title: 'লিসন ১০: যুক্তাক্ষর (Juktakkhor Basics)',
    level: 'Exam',
    description: 'g (Linker) ব্যবহার করে যুক্তাক্ষর তৈরি করা (যেমন ক+্+ক = ক্ক)।',
    words: [
      { keys: 'jgj', bangla: 'ক্ক' }, { keys: 'jgy', bangla: 'ক্চ' }, { keys: 'lgb', bangla: 'দ্ন' },
      { keys: 'lgh', bangla: 'দ্ব' }, { keys: 'sgl', bangla: 'ু্দ' }, { keys: 'vFjgj', bangla: 'রঅক্ক' },
      { keys: 'ngd', bangla: 'স্ি' }, { keys: 'vgl', bangla: 'র্ল' }, { keys: 'jgn', bangla: 'ক্স' }
    ]
  }
];
