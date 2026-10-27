import { Subject, Branch } from '../types';

// Physical Science Chapters (SCP - ଭୌତିକ ବିଜ୍ଞାନ)
import { rasayanikaPratikriyaChapter } from './bigyana/rasayanikaPratikriya';
import { amlaKhyarakaLabanaChapter } from './bigyana/amlaKhyarakaLabana';
import { dhatuAdhatuChapter } from './bigyana/dhatuAdhatu';
import { carbonJougikaChapter } from './bigyana/carbonJougika';
import { paryayiShrenikaranaChapter } from './bigyana/paryayiShrenikarana';
import { alokaPratifalanaChapter } from './bigyana/alokaPratifalana';
import { manabaChakhyuChapter } from './bigyana/manabaChakhyu';
import { bidyutChapter } from './bigyana/bidyut';
import { chumbakiyaPrabhabaChapter } from './bigyana/chumbakiyaPrabhaba';
import { shaktiraUtsaChapter } from './bigyana/shaktiraUtsa';

// Life Science Chapters (SCL - ଜୀବ ବିଜ୍ଞାନ)
import { poshanaChapter } from './bigyana/poshana';
import { swasanaChapter } from './bigyana/swasana';
import { paribahanaSanchalanaChapter } from './bigyana/paribahanaSanchalana';
import { rechanaChapter } from './bigyana/rechana';
import { niyantranaSamanwayaChapter } from './bigyana/niyantranaSamanwaya';
import { jananaChapter } from './bigyana/janana';
import { banshanukramaBibartanaChapter } from './bigyana/banshanukramaBibartana';
import { aamaParibeshaChapter } from './bigyana/aamaParibesha';
import { prakrutikaSampadaChapter } from './bigyana/prakrutikaSampada';

export const physicalScienceBranch: Branch = {
  id: 'physical_science',
  name: 'ଭୌତିକ ବିଜ୍ଞାନ',
  englishName: 'Physical Science (SCP)',
  description: 'ରସାୟନ ବିଜ୍ଞାନ, ଆଲୋକ, ବିଦ୍ୟୁତ, ଚୁମ୍ବକତ୍ୱ ଓ ଶକ୍ତିର ଉତ୍ସ (୧୦ ଟି ଅଧ୍ୟାୟ, ୨୦୦ ପ୍ରଶ୍ନ)',
  iconName: 'atom',
  colorTheme: {
    bgLight: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    accent: 'bg-cyan-600',
    gradient: 'from-cyan-600 to-blue-600'
  },
  chapters: [
    rasayanikaPratikriyaChapter,
    amlaKhyarakaLabanaChapter,
    dhatuAdhatuChapter,
    carbonJougikaChapter,
    paryayiShrenikaranaChapter,
    alokaPratifalanaChapter,
    manabaChakhyuChapter,
    bidyutChapter,
    chumbakiyaPrabhabaChapter,
    shaktiraUtsaChapter
  ]
};

export const lifeScienceBranch: Branch = {
  id: 'life_science',
  name: 'ଜୀବ ବିଜ୍ଞାନ',
  englishName: 'Life Science (SCL)',
  description: 'ପୋଷଣ, ଶ୍ୱସନ, ପରିବହନ, ରେଚନ, ନିୟନ୍ତ୍ରଣ, ଜନନ, ବଂଶାନୁକ୍ରମ ଓ ପରିବେଶ (୯ ଟି ଅଧ୍ୟାୟ, ୧୮୦ ପ୍ରଶ୍ନ)',
  iconName: 'dna',
  colorTheme: {
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    accent: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-teal-600'
  },
  chapters: [
    poshanaChapter,
    swasanaChapter,
    paribahanaSanchalanaChapter,
    rechanaChapter,
    niyantranaSamanwayaChapter,
    jananaChapter,
    banshanukramaBibartanaChapter,
    aamaParibeshaChapter,
    prakrutikaSampadaChapter
  ]
};

export const bigyanaSubject: Subject = {
  id: 'bigyana',
  name: 'ବିଜ୍ଞାନ',
  englishName: 'General Science (Class 10)',
  description: 'ଦଶମ ଶ୍ରେଣୀ ବିଜ୍ଞାନ - ଭୌତିକ ବିଜ୍ଞାନ ଓ ଜୀବ ବିଜ୍ଞାନ (ସମୁଦାୟ ୧୯ ଅଧ୍ୟାୟ, ୩୮୦ ପ୍ରଶ୍ନ)',
  iconName: 'atom',
  colorTheme: {
    bgLight: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    accent: 'bg-cyan-600',
    gradient: 'from-cyan-600 to-blue-600'
  },
  branches: [physicalScienceBranch, lifeScienceBranch],
  chapters: [
    ...physicalScienceBranch.chapters,
    ...lifeScienceBranch.chapters
  ]
};
