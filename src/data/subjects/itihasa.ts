import { Subject, Branch } from '../types';
import { gandhijiJatiyaAndolanaChapter } from './itihasa/gandhijiJatiyaAndolana';
import { asahayogAndolanaChapter } from './itihasa/asahayogAndolana';
import { aainAamanyaAndolanaChapter } from './itihasa/aainAamanyaAndolana';
import { bharataChhadaAndolanaChapter } from './itihasa/bharataChhadaAndolana';
import { netajiSubhasBoseChapter } from './itihasa/netajiSubhasBose';
import { bharataSwadhinataChapter } from './itihasa/bharataSwadhinata';
import { deshiyaRajyaMishranaChapter } from './itihasa/deshiyaRajyaMishrana';
import { goaPuducherryMuktiChapter } from './itihasa/goaPuducherryMukti';
import { odiaBhashaAndolanaChapter } from './itihasa/odiaBhashaAndolana';
import { utkalSammilaniChapter } from './itihasa/utkalSammilani';
import { swatantraOdishaGathanaChapter } from './itihasa/swatantraOdishaGathana';
import { odishaGarhjatPrajamandalChapter } from './itihasa/odishaGarhjatPrajamandal';
import { swadhinaBharataBikasaChapter } from './itihasa/swadhinaBharataBikasa';

import { bharataBaideshikaNitiChapter } from './itihasa/bharataBaideshikaNiti';
import { bharataPadoshiSamparkaChapter } from './itihasa/bharataPadoshiSamparka';
import { nirbachanaByabasthaChapter } from './itihasa/nirbachanaByabastha';
import { bharataraSambidhanaChapter } from './itihasa/bharataraSambidhana';
import { sanghiyaShasanaChapter } from './itihasa/sanghiyaShasana';
import { sadakaSurakshaChapter } from './itihasa/sadakaSuraksha';
import { ganatantraAwhanaChapter } from './itihasa/ganatantraAwhana';

export const historyBranch: Branch = {
  id: 'history',
  name: 'ଇତିହାସ',
  englishName: 'History',
  description: 'ଭାରତୀୟ ଜାତୀୟ ଆନ୍ଦୋଳନ, ନେତାଜୀ, ସ୍ୱତନ୍ତ୍ର ଓଡ଼ିଶା ପ୍ରଦେଶ ଗଠନ (୧୩ ଅଧ୍ୟାୟ, ୨୬୦ ପ୍ରଶ୍ନ)',
  iconName: 'landmark',
  colorTheme: {
    bgLight: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    accent: 'bg-rose-600',
    gradient: 'from-rose-600 to-red-700'
  },
  chapters: [
    gandhijiJatiyaAndolanaChapter,
    asahayogAndolanaChapter,
    aainAamanyaAndolanaChapter,
    bharataChhadaAndolanaChapter,
    netajiSubhasBoseChapter,
    bharataSwadhinataChapter,
    deshiyaRajyaMishranaChapter,
    goaPuducherryMuktiChapter,
    odiaBhashaAndolanaChapter,
    utkalSammilaniChapter,
    swatantraOdishaGathanaChapter,
    odishaGarhjatPrajamandalChapter,
    swadhinaBharataBikasaChapter
  ]
};

export const politicalScienceBranch: Branch = {
  id: 'political_science',
  name: 'ରାଜନୀତି ବିଜ୍ଞାନ',
  englishName: 'Political Science',
  description: 'ଭାରତର ବୈଦେଶିକ ନୀତି, ପଡ଼ୋଶୀ ସମ୍ପର୍କ, ନିର୍ବାଚନ, ସମ୍ବିଧାନ, ସଡ଼କ ସୁରକ୍ଷା ଓ ଗଣତନ୍ତ୍ର (୭ ଅଧ୍ୟାୟ, ୧୪୦ ପ୍ରଶ୍ନ)',
  iconName: 'landmark',
  colorTheme: {
    bgLight: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    accent: 'bg-amber-600',
    gradient: 'from-amber-600 to-orange-700'
  },
  chapters: [
    bharataBaideshikaNitiChapter,
    bharataPadoshiSamparkaChapter,
    nirbachanaByabasthaChapter,
    bharataraSambidhanaChapter,
    sanghiyaShasanaChapter,
    sadakaSurakshaChapter,
    ganatantraAwhanaChapter
  ]
};

export const itihasaSubject: Subject = {
  id: 'itihasa',
  name: 'ଇତିହାସ ଓ ରାଜନୀତି ବିଜ୍ଞାନ',
  englishName: 'History & Political Science (Class 10)',
  description: 'ଇତିହାସ ଏବଂ ରାଜନୀତି ବିଜ୍ଞାନର ଦୁଇଟି ମୁଖ୍ୟ ବିଭାଗ (୨୦ ଅଧ୍ୟାୟ, ୪୦୦ ପ୍ରଶ୍ନ)',
  iconName: 'landmark',
  colorTheme: {
    bgLight: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    accent: 'bg-rose-600',
    gradient: 'from-rose-600 to-red-600'
  },
  branches: [
    historyBranch,
    politicalScienceBranch
  ],
  chapters: [
    ...historyBranch.chapters,
    ...politicalScienceBranch.chapters
  ]
};
