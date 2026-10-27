import { SUBJECTS, Question } from './quizData';

export interface RunnerQuizGate {
  id: string;
  question: string;
  subjectName: string;
  options: [string, string, string]; // exactly 3 options for the 3 lanes
  correctLane: 0 | 1 | 2; // 0: Left, 1: Center, 2: Right
  explanation: string;
}

// Fallback high-frequency Class 10 questions for instant start
const CURATED_RUNNER_QUESTIONS: RunnerQuizGate[] = [
  {
    id: 'rq-1',
    question: 'ପ୍ରକାଶ ସଂଶ୍ଳେଷଣ ପ୍ରକ୍ରିୟାରେ କେଉଁ ଗ୍ୟାସ ଉତ୍ପନ୍ନ ହୁଏ?',
    subjectName: 'ଜୀବ ବିଜ୍ଞାନ',
    options: ['ଅମ୍ଳଜାନ (O₂)', 'ଅଙ୍ଗାରକାମ୍ଳ (CO₂)', 'ଯବକ୍ଷାରଜାନ (N₂)'],
    correctLane: 0,
    explanation: 'ଆଲୋକ ପ୍ରକ୍ରିୟାରେ ଜଳର ଆଲୋକ ବିଶ୍ଳେଷଣ ଘଟି ଅମ୍ଳଜାନ ନିର୍ଗତ ହୁଏ।'
  },
  {
    id: 'rq-2',
    question: 'ଉତ୍କଳମଣି ଗୋପବନ୍ଧୁ ଦାସଙ୍କ ପ୍ରତିଷ୍ଠିତ ବିଦ୍ୟାଳୟ କେଉଁଠାରେ ଅବସ୍ଥିତ?',
    subjectName: 'ସାହିତ୍ୟ ସିନ୍ଧୁ',
    options: ['କଟକ', 'ସତ୍ୟବାଦୀ ବକୁଳବନ', 'ଭୁବନେଶ୍ୱର'],
    correctLane: 1,
    explanation: 'ସାକ୍ଷୀଗୋପାଳର ସତ୍ୟବାଦୀ ବକୁଳବନରେ ବନ ବିଦ୍ୟାଳୟ ପ୍ରତିଷ୍ଠା ହୋଇଥିଲା।'
  },
  {
    id: 'rq-3',
    question: 'ମନୁଷ୍ୟ ହୃତ୍‌ପିଣ୍ଡରେ କେତୋଟି କୋଠରୀ ଥାଏ?',
    subjectName: 'ଜୀବ ବିଜ୍ଞାନ',
    options: ['୨ ଟି', '୩ ଟି', '୪ ଟି'],
    correctLane: 2,
    explanation: 'ମନୁଷ୍ୟ ହୃତ୍‌ପିଣ୍ଡ ୪ଟି କୋଠରୀ ବିଶିଷ୍ଟ: ୨ ଅଳିନ୍ଦ ଓ ୨ ନିଳୟ।'
  },
  {
    id: 'rq-4',
    question: 'ଓହ୍ମଙ୍କ ନିୟମ ଅନୁସାରେ ସୂତ୍ରଟି କ\'ଣ?',
    subjectName: 'ଭୌତିକ ବିଜ୍ଞାନ',
    options: ['V = I × R', 'P = V × I', 'F = m × a'],
    correctLane: 0,
    explanation: 'ଓହ୍ମଙ୍କ ନିୟମ ଅନୁଯାୟୀ ବିଭବାନ୍ତର V = IR।'
  },
  {
    id: 'rq-5',
    question: 'ଜାଲିଆନାୱାଲାବାଗ ହତ୍ୟାକାଣ୍ଡ କେବେ ସଂଘଠିତ ହୋଇଥିଲା?',
    subjectName: 'ଇତିହାସ',
    options: ['୧୯୨୧ ମସିହା', '୧୯୧୯ ଏପ୍ରିଲ ୧୩', '୧୯୩୦ ମାର୍ଚ୍ଚ'],
    correctLane: 1,
    explanation: '୧୯୧୯ ଏପ୍ରିଲ ୧୩ ତାରିଖରେ ଅମୃତସରରେ ଘଟିଥିଲା।'
  },
  {
    id: 'rq-6',
    question: 'ବୃତ୍ତର କ୍ଷେତ୍ରଫଳ ନିର୍ଣ୍ଣୟ ସୂତ୍ର କ\'ଣ?',
    subjectName: 'ଗଣିତ',
    options: ['2πr', '4πr²', 'πr²'],
    correctLane: 2,
    explanation: 'ବୃତ୍ତର କ୍ଷେତ୍ରଫଳ = πr²।'
  },
  {
    id: 'rq-7',
    question: 'ଭାରତର ପ୍ରଥମ ଜାତୀୟ ଉଦ୍ୟାନ କେଉଁଟି?',
    subjectName: 'ଭୂଗୋଳ',
    options: ['କରବେଟ୍ ଜାତୀୟ ଉଦ୍ୟାନ', 'ସିମିଳିପାଳ', 'କାଜିରଙ୍ଗା'],
    correctLane: 0,
    explanation: 'ଉତ୍ତରାଖଣ୍ଡର ଜିମ୍ କରବେଟ୍ ପ୍ରଥମ ଜାତୀୟ ଉଦ୍ୟାନ।'
  },
  {
    id: 'rq-8',
    question: '"ବନ୍ଦେ ଉତ୍କଳ ଜନନୀ" ସଂଗୀତର ରଚୟିତା କିଏ?',
    subjectName: 'ସାହିତ୍ୟ ସିନ୍ଧୁ',
    options: ['ରାଧାନାଥ ରାୟ', 'କାନ୍ତକବି ଲକ୍ଷ୍ମୀକାନ୍ତ ମହାପାତ୍ର', 'ମଧୁସୂଦନ ରାଓ'],
    correctLane: 1,
    explanation: 'କାନ୍ତକବି ଲକ୍ଷ୍ମୀକାନ୍ତ ମହାପାତ୍ର ଏହାର ରଚୟିତା।'
  },
  {
    id: 'rq-9',
    question: 'ଜଳର ରାସାୟନିକ ସଙ୍କେତ କ\'ଣ?',
    subjectName: 'ଭୌତିକ ବିଜ୍ଞାନ',
    options: ['H₂O₂', 'CO₂', 'H₂O'],
    correctLane: 2,
    explanation: 'ଜଳର ରାସାୟନିକ ସଙ୍କେତ H₂O।'
  },
  {
    id: 'rq-10',
    question: 'ଭାରତର ସର୍ବୋଚ୍ଚ ନ୍ୟାୟାଳୟ କେଉଁଠାରେ ଅବସ୍ଥିତ?',
    subjectName: 'ରାଜନୀତି ବିଜ୍ଞାନ',
    options: ['ନୂଆଦିଲ୍ଲୀ', 'ମୁମ୍ବାଇ', 'କୋଲକାତା'],
    correctLane: 0,
    explanation: 'ସୁପ୍ରିମ କୋର୍ଟ ନୂଆଦିଲ୍ଲୀରେ ଅବସ୍ଥିତ।'
  }
];

export function getRandomRunnerQuestion(): RunnerQuizGate {
  try {
    // Collect all questions from the subjects
    const allQuestions: { question: Question; subjectName: string }[] = [];
    SUBJECTS.forEach((sub) => {
      sub.chapters.forEach((ch) => {
        ch.questions.forEach((q) => {
          allQuestions.push({ question: q, subjectName: sub.name });
        });
      });
    });

    if (allQuestions.length > 0 && Math.random() > 0.3) {
      const picked = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      const q = picked.question;
      const correctText = q.options[q.correctIndex];
      
      // Get other incorrect options
      const incorrects = q.options.filter((_, idx) => idx !== q.correctIndex);
      // Pick 2 incorrect options
      const shuffledIncorrects = [...incorrects].sort(() => Math.random() - 0.5);
      const wrong1 = shuffledIncorrects[0] || 'ଅନ୍ୟାନ୍ୟ';
      const wrong2 = shuffledIncorrects[1] || 'କୌଣସିଟି ନୁହେଁ';

      // Pick lane 0, 1, or 2 for correct option
      const correctLane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
      const options: [string, string, string] = ['', '', ''];
      options[correctLane] = correctText;
      const otherLanes = [0, 1, 2].filter((l) => l !== correctLane);
      options[otherLanes[0]] = wrong1;
      options[otherLanes[1]] = wrong2;

      return {
        id: `gate-${q.id}-${Date.now()}`,
        question: q.question,
        subjectName: picked.subjectName,
        options,
        correctLane,
        explanation: q.explanation || 'ସଠିକ୍ ଉତ୍ତର!'
      };
    }
  } catch {
    // fallback
  }

  const idx = Math.floor(Math.random() * CURATED_RUNNER_QUESTIONS.length);
  return CURATED_RUNNER_QUESTIONS[idx];
}
