import { Chapter, Subject, Branch } from '../types';

// Literature Chapters (ସାହିତ୍ୟ: ଗଦ୍ୟ ଓ ପଦ୍ୟ)
import { kantaKabiBandeUtkalaChapter } from './odia/kantaKabiBandeUtkala';
import { bheemaSinghanadaChapter } from './odia/bheemaSinghanada';
import { raghavaLankaJatraChapter } from './odia/raghavaLankaJatra';
import { chilikareSayantanaChapter } from './odia/chilikareSayantana';
import { mangaleAilaUshaChapter } from './odia/mangaleAilaUsha';
import { jagaBandhanaHaraChapter } from './odia/jagaBandhanaHara';
import { sarbangsahaMatiChapter } from './odia/sarbangsahaMati';
import { janmabhumiChapter } from './odia/janmabhumi';
import { sabhyataOBigyanChapter } from './odia/sabhyataOBigyan';
import { matrubhashaOLokashikshyaChapter } from './odia/matrubhashaOLokashikshya';
import { narenRuVivekanandaChapter } from './odia/narenRuVivekananda';
import { odiaSahityaKathaChapter } from './odia/odiaSahityaKatha';
import { kathaChapter } from './odia/katha';
import { kalaraKapolaTaleChapter } from './odia/kalaraKapolaTale';
import { belaAsataBatabrukshyaChapter } from './odia/belaAsataBatabrukshya';
import { falguChapter } from './odia/falgu';
import { konarkaChapter } from './odia/konarka';

// Grammar Chapters (ଓଡ଼ିଆ ବ୍ୟାକରଣ)
import { bakyaBicharaChapter } from './odia/byakarana/bakyaBichara';
import { shabdaGathanaChapter } from './odia/byakarana/shabdaGathana';
import { sandhiSamasaChapter } from './odia/byakarana/sandhiSamasa';
import { chhandaAlankaraChapter } from './odia/byakarana/chhandaAlankara';
import { rudhiLokabaniChapter } from './odia/byakarana/rudhiLokabani';
import { ashuddhiSanshodhanaChapter } from './odia/byakarana/ashuddhiSanshodhana';

export const odiaLiteratureBranch: Branch = {
  id: 'odia_literature',
  name: 'ସାହିତ୍ୟ (ଗଦ୍ୟ ଓ ପଦ୍ୟ)',
  englishName: 'Odia Literature (Sahitya Sindhu)',
  description: 'ଦଶମ ଶ୍ରେଣୀ ସାହିତ୍ୟ ସିନ୍ଧୁ - ପଦ୍ୟ, ଗଦ୍ୟ, ଗଳ୍ପ ଓ ଏକାଙ୍କିକା (୧୭ ଟି ଅଧ୍ୟାୟ, ୩୪୦ ପ୍ରଶ୍ନ)',
  iconName: 'book-open',
  colorTheme: {
    bgLight: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    accent: 'bg-amber-600',
    gradient: 'from-amber-600 to-orange-600'
  },
  chapters: [
    kantaKabiBandeUtkalaChapter,
    bheemaSinghanadaChapter,
    raghavaLankaJatraChapter,
    chilikareSayantanaChapter,
    mangaleAilaUshaChapter,
    jagaBandhanaHaraChapter,
    sarbangsahaMatiChapter,
    janmabhumiChapter,
    sabhyataOBigyanChapter,
    matrubhashaOLokashikshyaChapter,
    narenRuVivekanandaChapter,
    odiaSahityaKathaChapter,
    kathaChapter,
    kalaraKapolaTaleChapter,
    belaAsataBatabrukshyaChapter,
    falguChapter,
    konarkaChapter
  ]
};

export const odiaGrammarBranch: Branch = {
  id: 'odia_grammar',
  name: 'ଓଡ଼ିଆ ବ୍ୟାକରଣ',
  englishName: 'Odia Grammar (ମାଧ୍ୟମିକ ବ୍ୟାକରଣ)',
  description: 'ବାକ୍ୟ ବିଚାର, ଶବ୍ଦ ଗଠନ, ସନ୍ଧି, ସମାସ, ଛନ୍ଦ, ଅଳଙ୍କାର, ରୂଢ଼ି, ଲୋକବାଣୀ ଓ ଅଶୁଦ୍ଧି ସଂଶୋଧନ (୬ ଟି ଅଧ୍ୟାୟ, ୧୨୦ ପ୍ରଶ୍ନ)',
  iconName: 'languages',
  colorTheme: {
    bgLight: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    accent: 'bg-orange-600',
    gradient: 'from-orange-600 to-amber-700'
  },
  chapters: [
    bakyaBicharaChapter,
    shabdaGathanaChapter,
    sandhiSamasaChapter,
    chhandaAlankaraChapter,
    rudhiLokabaniChapter,
    ashuddhiSanshodhanaChapter
  ]
};

export const odiaSubject: Subject = {
  id: 'sahitya',
  name: 'ଓଡ଼ିଆ',
  englishName: 'Odia (Class 10 FLO)',
  description: 'ଦଶମ ଶ୍ରେଣୀ ଓଡ଼ିଆ - ସାହିତ୍ୟ (ଗଦ୍ୟ-ପଦ୍ୟ) ଓ ମାଧ୍ୟମିକ ବ୍ୟାକରଣ (୨୩ ଟି ଅଧ୍ୟାୟ, ୪୬୦ ପ୍ରଶ୍ନ)',
  iconName: 'book-open',
  colorTheme: {
    bgLight: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    accent: 'bg-amber-600',
    gradient: 'from-amber-600 to-orange-600'
  },
  branches: [odiaLiteratureBranch, odiaGrammarBranch],
  chapters: [
    ...odiaLiteratureBranch.chapters,
    ...odiaGrammarBranch.chapters
  ]
};
