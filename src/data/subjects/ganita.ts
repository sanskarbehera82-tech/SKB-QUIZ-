import { Subject, Branch } from '../types';
import { saralaSahasamikaranaChapter } from './ganita/saralaSahasamikarana';
import { dwighataSamikaranaChapter } from './ganita/dwighataSamikarana';
import { samantaraPragatiChapter } from './ganita/samantaraPragati';
import { sambhabyataChapter } from './ganita/sambhabyata';
import { parisankhyanaChapter } from './ganita/parisankhyana';
import { sadakaSurakshaGanitaChapter } from './ganita/sadakaSurakshaGanita';

import { jyamitireSadrusyaChapter } from './ganita/jyamitireSadrusya';
import { bruttaChapter } from './ganita/brutta';
import { bruttaraSparshakaChapter } from './ganita/bruttaraSparshaka';
import { trikonamitiChapter } from './ganita/trikonamiti';
import { parimitiChapter } from './ganita/parimiti';
import { sthanankaJyamitiChapter } from './ganita/sthanankaJyamiti';

export const algebraBranch: Branch = {
  id: 'algebra',
  name: 'ବୀଜଗଣିତ',
  englishName: 'Algebra (ମାଧ୍ୟମିକ ବୀଜଗଣିତ)',
  description: 'ସରଳ ସହସମୀକରଣ, ଦ୍ୱିଘାତ ସମୀକରଣ, ସମାନ୍ତର ପ୍ରଗତି, ସମ୍ଭାବ୍ୟତା, ପରିସଂଖ୍ୟାନ ଓ ସଡ଼କ ସୁରକ୍ଷା',
  iconName: 'calculator',
  colorTheme: {
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    accent: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-teal-600'
  },
  chapters: [
    saralaSahasamikaranaChapter,
    dwighataSamikaranaChapter,
    samantaraPragatiChapter,
    sambhabyataChapter,
    parisankhyanaChapter,
    sadakaSurakshaGanitaChapter
  ]
};

export const geometryBranch: Branch = {
  id: 'geometry',
  name: 'ଜ୍ୟାମିତି',
  englishName: 'Geometry (ମାଧ୍ୟମିକ ଜ୍ୟାମିତି)',
  description: 'ଜ୍ୟାମିତିରେ ସାଦୃଶ୍ୟ, ବୃତ୍ତ, ବୃତ୍ତର ସ୍ପର୍ଶକ, ତ୍ରିକୋଣମିତି, ପରିମିତି ଓ ସ୍ଥାନାଙ୍କ ଜ୍ୟାମିତି',
  iconName: 'shapes',
  colorTheme: {
    bgLight: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
    accent: 'bg-teal-600',
    gradient: 'from-teal-600 to-cyan-600'
  },
  chapters: [
    jyamitireSadrusyaChapter,
    bruttaChapter,
    bruttaraSparshakaChapter,
    trikonamitiChapter,
    parimitiChapter,
    sthanankaJyamitiChapter
  ]
};

export const ganitaSubject: Subject = {
  id: 'ganita',
  name: 'ଗଣିତ',
  englishName: 'Mathematics (Class 10)',
  description: 'ଦଶମ ଶ୍ରେଣୀ ଗଣିତ - ବୀଜଗଣିତ ଓ ଜ୍ୟାମିତି (ସମୁଦାୟ ୧୨ ଅଧ୍ୟାୟ, ୨୪୦ ପ୍ରଶ୍ନ)',
  iconName: 'calculator',
  colorTheme: {
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    accent: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-teal-600'
  },
  branches: [algebraBranch, geometryBranch],
  chapters: [
    ...algebraBranch.chapters,
    ...geometryBranch.chapters
  ]
};
