import { Subject, Branch } from '../types';

// Literature Chapters (Prose, Poetry and Stories)
import { allThingsBrightChapter } from './english/allThingsBright';
import { letterToGodChapter } from './english/letterToGod';
import { solitaryReaperChapter } from './english/solitaryReaper';
import { atTheHighSchoolChapter } from './english/atTheHighSchool';
import { villageSongChapter } from './english/villageSong';
import { festivalsOfNorthEastChapter } from './english/festivalsOfNorthEast';
import { flowerSchoolChapter } from './english/flowerSchool';
import { airPollutionChapter } from './english/airPollution';
import { fromTheFormalinJarChapter } from './english/fromTheFormalinJar';
import { schoolsGoodbyeChapter } from './english/schoolsGoodbye';
import { tigerInTheHouseChapter } from './english/tigerInTheHouse';
import { theBeggarChapter } from './english/theBeggar';
import { villageJudgeChapter } from './english/villageJudge';
import { grainAsBigAsHenEggChapter } from './english/grainAsBigAsHenEgg';
import { greatSonOfIndiaChapter } from './english/greatSonOfIndia';

// Grammar Chapters
import { typesOfSentencesChapter } from './english/grammar/typesOfSentences';
import { subjectVerbAgreementChapter } from './english/grammar/subjectVerbAgreement';
import { nonFiniteVerbsChapter } from './english/grammar/nonFiniteVerbs';
import { prepositionsChapter } from './english/grammar/prepositions';
import { nounClausesChapter } from './english/grammar/nounClauses';
import { passiveVoiceChapter } from './english/grammar/passiveVoice';

export const englishLiteratureBranch: Branch = {
  id: 'english_literature',
  name: 'English Poetry & Prose',
  englishName: 'Literature (Skills for Communicative English)',
  description: 'Class 10 English Literature - Prose, Poetry & Non-Detailed Stories (15 Chapters, 300 Questions)',
  iconName: 'book-open',
  colorTheme: {
    bgLight: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    accent: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-blue-600'
  },
  chapters: [
    allThingsBrightChapter,
    letterToGodChapter,
    solitaryReaperChapter,
    atTheHighSchoolChapter,
    villageSongChapter,
    festivalsOfNorthEastChapter,
    flowerSchoolChapter,
    airPollutionChapter,
    fromTheFormalinJarChapter,
    schoolsGoodbyeChapter,
    tigerInTheHouseChapter,
    theBeggarChapter,
    villageJudgeChapter,
    grainAsBigAsHenEggChapter,
    greatSonOfIndiaChapter
  ]
};

export const englishGrammarBranch: Branch = {
  id: 'english_grammar',
  name: 'English Grammar',
  englishName: 'English Grammar (BSE Odisha)',
  description: 'Sentence Types, Concord, Non-Finite Verbs, Prepositions, Clauses, Passive Voice & Reported Speech (6 Chapters, 120 Questions)',
  iconName: 'languages',
  colorTheme: {
    bgLight: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    accent: 'bg-blue-600',
    gradient: 'from-blue-600 to-cyan-600'
  },
  chapters: [
    typesOfSentencesChapter,
    subjectVerbAgreementChapter,
    nonFiniteVerbsChapter,
    prepositionsChapter,
    nounClausesChapter,
    passiveVoiceChapter
  ]
};

export const englishSubject: Subject = {
  id: 'english',
  name: 'ଇଂରାଜୀ',
  englishName: 'English (Class 10 SLE)',
  description: 'ଦଶମ ଶ୍ରେଣୀ ଇଂରାଜୀ - Literature (Prose & Poetry) ଏବଂ Grammar (୨୧ ଟି ଅଧ୍ୟାୟ, ୪୨୦ ପ୍ରଶ୍ନ)',
  iconName: 'languages',
  colorTheme: {
    bgLight: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    accent: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-blue-600'
  },
  branches: [englishLiteratureBranch, englishGrammarBranch],
  chapters: [
    ...englishLiteratureBranch.chapters,
    ...englishGrammarBranch.chapters
  ]
};
