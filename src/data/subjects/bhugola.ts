import { Subject, Branch } from '../types';
import { sambalaBikashaChapter } from './bhugola/geography/sambalaBikasha';
import { banaBanyapraniChapter } from './bhugola/geography/banaBanyaprani';
import { jalaSambalaChapter } from './bhugola/geography/jalaSambala';
import { krushiChapter } from './bhugola/geography/krushi';
import { khanijaShaktiSambalaChapter } from './bhugola/geography/khanijaShaktiSambala';
import { utpadanaShilpaChapter } from './bhugola/geography/utpadanaShilpa';
import { paribahanaBajigyaChapter } from './bhugola/geography/paribahanaBajigya';

import { arthanaitikaBikashaChapter } from './bhugola/economics/arthanaitikaBikasha';
import { udarikaranaJagatikaranaChapter } from './bhugola/economics/udarikaranaJagatikarana';
import { mudraByankSamsthanChapter } from './bhugola/economics/mudraByankSamsthan';
import { upabhoktaSachetanataChapter } from './bhugola/economics/upabhoktaSachetanata';

export const geographyBranch: Branch = {
  id: 'geography',
  name: 'ଭୂଗୋଳ',
  englishName: 'Geography',
  description: 'ସମ୍ବଳ, ଜଳ, କୃଷି, ଖଣିଜ, ଶିଳ୍ପ ଓ ପରିବହନ (୭ ଅଧ୍ୟାୟ, ୧୪୦ ପ୍ରଶ୍ନ)',
  iconName: 'globe',
  colorTheme: {
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    accent: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-teal-700'
  },
  chapters: [
    sambalaBikashaChapter,
    banaBanyapraniChapter,
    jalaSambalaChapter,
    krushiChapter,
    khanijaShaktiSambalaChapter,
    utpadanaShilpaChapter,
    paribahanaBajigyaChapter
  ]
};

export const economicsBranch: Branch = {
  id: 'economics',
  name: 'ଅର୍ଥନୀତି',
  englishName: 'Economics',
  description: 'ଅର୍ଥନୈତିକ ବିକାଶ, LPG ସଂସ୍କାର, ମୁଦ୍ରା ଓ ବ୍ୟାଙ୍କିଙ୍ଗ୍, ଖାଉଟି ସୁରକ୍ଷା (୪ ଅଧ୍ୟାୟ, ୮୦ ପ୍ରଶ୍ନ)',
  iconName: 'trending-up',
  colorTheme: {
    bgLight: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
    accent: 'bg-teal-600',
    gradient: 'from-teal-600 to-cyan-700'
  },
  chapters: [
    arthanaitikaBikashaChapter,
    udarikaranaJagatikaranaChapter,
    mudraByankSamsthanChapter,
    upabhoktaSachetanataChapter
  ]
};

export const bhugolaSubject: Subject = {
  id: 'bhugola',
  name: 'ଭୂଗୋଳ ଓ ଅର୍ଥନୀତି',
  englishName: 'Geography & Economics (Class 10)',
  description: 'ଭୂଗୋଳ ଏବଂ ଅର୍ଥନୀତିର ଦୁଇଟି ମୁଖ୍ୟ ବିଭାଗ (୧୧ ଅଧ୍ୟାୟ, ୨୨୦ ପ୍ରଶ୍ନ)',
  iconName: 'globe',
  colorTheme: {
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    accent: 'bg-emerald-600',
    gradient: 'from-teal-600 to-emerald-600'
  },
  branches: [
    geographyBranch,
    economicsBranch
  ],
  chapters: [
    ...geographyBranch.chapters,
    ...economicsBranch.chapters
  ]
};
