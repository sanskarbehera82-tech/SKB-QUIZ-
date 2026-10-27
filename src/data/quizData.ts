/**
 * SKV Quiz - Class 10 Odia Medium Comprehensive Question Bank
 * Every chapter includes 20 multiple-choice questions with 4 options and detailed Odia/Hindi explanations.
 */

import { Subject } from './types';
import { odiaSubject } from './subjects/odia';
import { englishSubject } from './subjects/english';
import { hindiSubject } from './subjects/hindi';
import { ganitaSubject } from './subjects/ganita';
import { bigyanaSubject } from './subjects/bigyana';
import { itihasaSubject } from './subjects/itihasa';
import { bhugolaSubject } from './subjects/bhugola';

export * from './types';

export const SUBJECTS: Subject[] = [
  odiaSubject,
  englishSubject,
  hindiSubject,
  ganitaSubject,
  bigyanaSubject,
  itihasaSubject,
  bhugolaSubject
];

export function getTotalStats() {
  const totalSubjects = SUBJECTS.length;
  let totalChapters = 0;
  let totalQuestions = 0;

  SUBJECTS.forEach((sub) => {
    totalChapters += sub.chapters.length;
    sub.chapters.forEach((ch) => {
      totalQuestions += ch.questions.length;
    });
  });

  return { totalSubjects, totalChapters, totalQuestions };
}
