import { Subject, Branch } from '../types';

// Hindi Literature Chapters (गद्य एवं पद्य)
import { anmolVaniChapter } from './hindi/anmolVani';
import { manushyataChapter } from './hindi/manushyata';
import { ekTinkaChapter } from './hindi/ekTinka';
import { chandKaKurtaChapter } from './hindi/chandKaKurta';
import { jhansiKiRaniChapter } from './hindi/jhansiKiRani';
import { madhurDeepakChapter } from './hindi/madhurDeepak';
import { gilluChapter } from './hindi/gillu';
import { bodhPremchandChapter } from './hindi/bodhPremchand';

// Hindi Grammar Chapters (व्याकरण)
import { sangyaSarvanamChapter } from './hindi/grammar/sangyaSarvanam';
import { lingVachanKarakChapter } from './hindi/grammar/lingVachanKarak';
import { kriyaKaalVachyaChapter } from './hindi/grammar/kriyaKaalVachya';
import { upsargPratyaySandhiChapter } from './hindi/grammar/upsargPratyaySandhi';
import { muhavareLokoktiyanChapter } from './hindi/grammar/muhavareLokoktiyan';

export const hindiLiteratureBranch: Branch = {
  id: 'hindi_literature',
  name: 'हिंदी साहित्य (गद्य एवं पद्य)',
  englishName: 'Hindi Literature (Manjari)',
  description: 'दशम श्रेणी हिंदी साहित्य - पद्य, दोहा, गद्य, रेखाचित्र एवं कहानी (८ अध्याय, १६० प्रश्न)',
  iconName: 'book-open',
  colorTheme: {
    bgLight: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    accent: 'bg-rose-600',
    gradient: 'from-rose-600 to-red-600'
  },
  chapters: [
    anmolVaniChapter,
    manushyataChapter,
    ekTinkaChapter,
    chandKaKurtaChapter,
    jhansiKiRaniChapter,
    madhurDeepakChapter,
    gilluChapter,
    bodhPremchandChapter
  ]
};

export const hindiGrammarBranch: Branch = {
  id: 'hindi_grammar',
  name: 'हिंदी व्याकरण',
  englishName: 'Hindi Grammar',
  description: 'संज्ञा, सर्वनाम, विशेषण, लिंग, वचन, कारक, क्रिया, काल, वाच्य, उपसर्ग, प्रत्यय, संधि, समास एवं मुहावरे (५ अध्याय, १०० प्रश्न)',
  iconName: 'languages',
  colorTheme: {
    bgLight: 'bg-pink-50',
    text: 'text-pink-800',
    border: 'border-pink-200',
    accent: 'bg-pink-600',
    gradient: 'from-pink-600 to-rose-700'
  },
  chapters: [
    sangyaSarvanamChapter,
    lingVachanKarakChapter,
    kriyaKaalVachyaChapter,
    upsargPratyaySandhiChapter,
    muhavareLokoktiyanChapter
  ]
};

export const hindiSubject: Subject = {
  id: 'hindi',
  name: 'ହିନ୍ଦୀ',
  englishName: 'Hindi (Class 10 TLH)',
  description: 'दशम श्रेणी हिंदी - हिंदी साहित्य (गद्य-पद्य) एवं हिंदी व्याकरण (१३ अध्याय, २६० प्रश्न)',
  iconName: 'languages',
  colorTheme: {
    bgLight: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    accent: 'bg-rose-600',
    gradient: 'from-rose-600 to-red-600'
  },
  branches: [hindiLiteratureBranch, hindiGrammarBranch],
  chapters: [
    ...hindiLiteratureBranch.chapters,
    ...hindiGrammarBranch.chapters
  ]
};
