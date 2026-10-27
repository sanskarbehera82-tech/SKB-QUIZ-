export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  questionCount: number;
  estimatedMinutes: number;
  questions: Question[];
}

export interface Branch {
  id: string;
  name: string;
  englishName: string;
  description: string;
  iconName?: 'calculator' | 'shapes' | string;
  colorTheme: {
    bgLight: string;
    text: string;
    border: string;
    accent: string;
    gradient: string;
  };
  chapters: Chapter[];
}

export interface Subject {
  id: string;
  name: string;
  englishName: string;
  description: string;
  iconName: 'book-open' | 'languages' | 'calculator' | 'atom' | 'landmark' | 'globe';
  colorTheme: {
    bgLight: string;
    text: string;
    border: string;
    accent: string;
    gradient: string;
  };
  chapters: Chapter[];
  branches?: Branch[];
}
