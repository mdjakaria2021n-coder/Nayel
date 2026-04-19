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
    title: 'Lesson 1: Home Row Basics',
    level: 'Beginner',
    description: 'Learn the primary home row keys.',
    words: [
      { keys: 'j', bangla: 'ক' },
      { keys: 'f', bangla: 'া' },
      { keys: 'd', bangla: 'ি' },
      { keys: 'k', bangla: 'ত' },
      { keys: 's', bangla: 'ু' },
      { keys: 'l', bangla: 'দ' },
      { keys: 'a', bangla: 'ৃ' },
      { keys: ';', bangla: 'ম' },
      { keys: 'jfj', bangla: 'কাক' },
      { keys: 'kfk', bangla: 'তাত' }
    ]
  },
  {
    id: 2,
    title: 'Lesson 2: Top Row Intro',
    level: 'Beginner',
    description: 'Practice the top row keys for common characters.',
    words: [
      { keys: 'r', bangla: 'প' },
      { keys: 'e', bangla: 'ড' },
      { keys: 'y', bangla: 'চ' },
      { keys: 'u', bangla: 'জ' },
      { keys: 'o', bangla: 'গ' },
      { keys: 'rfr', bangla: 'পাপ' },
      { keys: 'yfy', bangla: 'চাচ' },
      { keys: 'ofo', bangla: 'গাগ' },
      { keys: 'ufo', bangla: 'জাগ' }
    ]
  },
  {
    id: 3,
    title: 'Lesson 3: Bottom Row & Modifiers',
    level: 'Intermediate',
    description: 'Introduce the bottom row and shifts.',
    words: [
      { keys: 'v', bangla: 'র' },
      { keys: 'b', bangla: 'ন' },
      { keys: 'n', bangla: 'স' },
      { keys: 'm', bangla: 'ল' },
      { keys: 'vf', bangla: 'রা' },
      { keys: 'bf', bangla: 'না' },
      { keys: 'nfn', bangla: 'সান' },
      { keys: 'vfv', bangla: 'রার' }
    ]
  },
  {
    id: 4,
    title: 'Lesson 4: Juktakkhor (Joint Letters)',
    level: 'Advanced',
    description: 'Mastery of the linker key (hasant).',
    words: [
      { keys: 'jgj', bangla: 'ক্ক' },
      { keys: 'jgy', bangla: 'ক্চ' },
      { keys: 'lgb', bangla: 'দ্ন' },
      { keys: 'lgh', bangla: 'দ্ব' },
      { keys: 'vFjgj', bangla: 'রঅক্ক' },
      { keys: 'kgl', bangla: 'ত্দ' }
    ]
  },
  {
    id: 5,
    title: 'Word Drill: Common Words',
    level: 'Advanced',
    description: 'Practice commonly used Bangla words.',
    words: [
      { keys: 'kdv', bangla: 'তির' },
      { keys: 'vf', bangla: 'রা' },
      { keys: 'yfd', bangla: 'চাহি' },
      { keys: 'jdf', bangla: 'কিয়া' }
    ]
  }
];
