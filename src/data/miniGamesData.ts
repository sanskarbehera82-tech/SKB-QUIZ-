export interface MatchPair {
  id: string;
  left: string; // Term, Book, Scientist, Formula, Law, Event
  right: string; // Answer, Author, Definition, Value, Year
  category: 'odia' | 'english' | 'science' | 'math' | 'history' | 'geography' | 'hindi';
  categoryOdia: string;
}

export interface LightningQuestion {
  id: string;
  question: string;
  options: [string, string];
  correctIndex: number; // 0 or 1
  explanation: string;
  categoryOdia: string;
}

export const SPEED_MATCH_PAIRS: MatchPair[] = [
  // Odia Sahitya
  { id: 'm-od1', left: 'ଆଦିକବି', right: 'ସାରଳା ଦାସ', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od2', left: 'କବିସମ୍ରାଟ', right: 'ଉପେନ୍ଦ୍ର ଭଞ୍ଜ', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od3', left: 'ବ୍ୟାସକବି', right: 'ଫକୀର ମୋହନ', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od4', left: 'ସ୍ୱଭାବ କବି', right: 'ଗଙ୍ଗାଧର ମେହେର', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od5', left: 'ଭକ୍ତକବି', right: 'ମଧୁସୂଦନ ରାଓ', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od6', left: 'କାନ୍ତକବି', right: 'ଲକ୍ଷ୍ମୀକାନ୍ତ ମହାପାତ୍ର', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od7', left: 'ବନ୍ଦେ ଉତ୍କଳ ଜନନୀ', right: 'ରାଜ୍ୟ ସଙ୍ଗୀତ', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od8', left: 'ବୈଦେହୀଶ ବିଳାସ', right: "'ବ' ଆଦ୍ୟ ନିୟମ", category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },
  { id: 'm-od9', left: 'ଛମାଣ ଆଠଗୁଣ୍ଠ', right: 'ରାମଚନ୍ଦ୍ର ମଙ୍ଗରାଜ', category: 'odia', categoryOdia: 'ସାହିତ୍ୟ' },

  // English Literature
  { id: 'm-en1', left: 'A Letter to God', right: 'Lencho', category: 'english', categoryOdia: 'English' },
  { id: 'm-en2', left: 'The Solitary Reaper', right: 'William Wordsworth', category: 'english', categoryOdia: 'English' },
  { id: 'm-en3', left: 'A Tiger in the House', right: 'Ruskin Bond', category: 'english', categoryOdia: 'English' },
  { id: 'm-en4', left: 'The Beggar', right: 'Anton Chekhov', category: 'english', categoryOdia: 'English' },
  { id: 'm-en5', left: 'The Village Judge', right: 'Premchand', category: 'english', categoryOdia: 'English' },
  { id: 'm-en6', left: 'Village Song', right: 'Sarojini Naidu', category: 'english', categoryOdia: 'English' },

  // Science
  { id: 'm-sc1', left: 'ଓମ୍‌ଙ୍କ ନିୟମ', right: 'V = IR', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc2', left: 'ଜୁଲ୍‌ଙ୍କ ତାପନ ନିୟମ', right: 'H = I²Rt', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc3', left: 'ବିଦ୍ୟୁତ୍ ବିଭବାନ୍ତର', right: 'ଭୋଲ୍ଟ (Volt)', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc4', left: 'ବିଦ୍ୟୁତ୍ ସ୍ରୋତ', right: 'ଆମ୍ପିୟର (Ampere)', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc5', left: 'ଚୁମ୍ବକୀୟ ପ୍ରଭାବ', right: 'ଓଏର୍ଷ୍ଟେଡ୍ (Oersted)', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc6', left: 'କୋଷର ଶକ୍ତି ମୁଦ୍ରା', right: 'ATP', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc7', left: 'କୋଷର ଶକ୍ତିକେନ୍ଦ୍ର', right: 'ମାଇଟୋକଣ୍ଡ୍ରିଆ', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc8', left: 'ବଂଶଗତି ବିଜ୍ଞାନର ପିତା', right: 'ଗ୍ରେଗର ମେଣ୍ଡେଲ', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc9', left: 'ରକ୍ତଚାପ ମାପକ ଯନ୍ତ୍ର', right: 'ସ୍ଫିଗ୍ମୋମାନୋମିଟର', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },
  { id: 'm-sc10', left: 'ଜଳ ନିର୍ଗମନ ପ୍ରକ୍ରିୟା', right: 'ଉତ୍ସ୍ୱେଦନ (Transpiration)', category: 'science', categoryOdia: 'ବିଜ୍ଞାନ' },

  // Mathematics
  { id: 'm-mt1', left: 'ଦ୍ୱିଘାତ ସୂତ୍ର', right: '(-b ± √D)/2a', category: 'math', categoryOdia: 'ଗଣିତ' },
  { id: 'm-mt2', left: 'ପ୍ରଭେଦକ (Discriminant)', right: 'D = b² - 4ac', category: 'math', categoryOdia: 'ଗଣିତ' },
  { id: 'm-mt3', left: 'ସମାନ୍ତର ପ୍ରଗତି nth ପଦ', right: 'a + (n-1)d', category: 'math', categoryOdia: 'ଗଣିତ' },
  { id: 'm-mt4', left: 'ବୃତ୍ତର ପରିଧି', right: '2πr', category: 'math', categoryOdia: 'ଗଣିତ' },
  { id: 'm-mt5', left: 'ବୃତ୍ତର କ୍ଷେତ୍ରଫଳ', right: 'πr²', category: 'math', categoryOdia: 'ଗଣିତ' },
  { id: 'm-mt6', left: 'ସିଲିଣ୍ଡର ବକ୍ରପୃଷ୍ଠ କ୍ଷେତ୍ରଫଳ', right: '2πrh', category: 'math', categoryOdia: 'ଗଣିତ' },
  { id: 'm-mt7', left: 'sin²θ + cos²θ', right: '୧ (One)', category: 'math', categoryOdia: 'ଗଣିତ' },

  // History & Civics
  { id: 'm-hs1', left: 'ଉତ୍କଳ ସମ୍ମିଳନୀ ଗଠନ', right: '୧୯୦୩ (ମଧୁବାବୁ)', category: 'history', categoryOdia: 'ଇତିହାସ' },
  { id: 'm-hs2', left: 'ସ୍ୱତନ୍ତ୍ର ଓଡ଼ିଶା ପ୍ରଦେଶ', right: '୧ ଏପ୍ରିଲ ୧୯୩୬', category: 'history', categoryOdia: 'ଇତିହାସ' },
  { id: 'm-hs3', left: 'ଇଞ୍ଚୁଡ଼ି ଲବଣ ସତ୍ୟାଗ୍ରହ', right: '୧୯୩୦ (ବାଲେଶ୍ୱର)', category: 'history', categoryOdia: 'ଇତିହାସ' },
  { id: 'm-hs4', left: 'ଭାରତ ଛାଡ଼ ଆନ୍ଦୋଳନ', right: '୧୯୪୨ ଅଗଷ୍ଟ', category: 'history', categoryOdia: 'ଇତିହାସ' },
  { id: 'm-hs5', left: 'ରକ୍ତତୀର୍ଥ ଇରମ ହତ୍ୟାକାଣ୍ଡ', right: '୨୮ ସେପ୍ଟେମ୍ବର ୧୯୪୨', category: 'history', categoryOdia: 'ଇତିହାସ' },
  { id: 'm-hs6', left: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର', right: 'ଲାଙ୍ଗୁଳା ନରସିଂହଦେବ', category: 'history', categoryOdia: 'ଇତିହାସ' },

  // Geography & Economics
  { id: 'm-ge1', left: 'ହୀରାକୁଦ ନଦୀବନ୍ଧ', right: 'ମହାନଦୀ (ସମ୍ବଲପୁର)', category: 'geography', categoryOdia: 'ଭୂଗୋଳ' },
  { id: 'm-ge2', left: 'ବକ୍ସାଇଟ୍ ଖଣି', right: 'ପଞ୍ଚପଟମାଳୀ (କୋରାପୁଟ)', category: 'geography', categoryOdia: 'ଭୂଗୋଳ' },
  { id: 'm-ge3', left: 'ଜାତୀୟ ଉଦ୍ୟାନ', right: 'ଭିତରକନିକା / ଶିମିଳିପାଳ', category: 'geography', categoryOdia: 'ଭୂଗୋଳ' },
  { id: 'm-ge4', left: 'ମାନବ ବିକାଶ ସୂଚକାଙ୍କ', right: 'UNDP', category: 'geography', categoryOdia: 'ଅର୍ଥନୀତି' }
];

export const LIGHTNING_QUESTIONS: LightningQuestion[] = [
  {
    id: 'lq-1',
    question: "ସାରଳା ଦାସଙ୍କୁ ଓଡ଼ିଆ ସାହିତ୍ୟର 'ଆଦିକବି' କୁହାଯାଏ କି?",
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ସାରଳା ମହାଭାରତ ରଚୟିତା ସାରଳା ଦାସ ଓଡ଼ିଆ ଭାଷା ସାହିତ୍ୟର ଆଦିକବି ଅଟନ୍ତି।',
    categoryOdia: 'ସାହିତ୍ୟ'
  },
  {
    id: 'lq-2',
    question: 'ପାଣି (H2O) ଏକ ମୌଳିକ ପଦାର୍ଥ ଅଟେ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'ମିଛ! ପାଣି ହାଇଡ୍ରୋଜେନ୍ ଓ ଅକ୍ସିଜେନ୍ ର ଏକ ଯୌଗିକ (Compound) ଅଟେ।',
    categoryOdia: 'ବିଜ୍ଞାନ'
  },
  {
    id: 'lq-3',
    question: 'ସ୍ୱତନ୍ତ୍ର ଓଡ଼ିଶା ପ୍ରଦେଶ ୧୯୩୬ ମସିହା ଏପ୍ରିଲ ୧ ତାରିଖରେ ଗଠିତ ହୋଇଥିଲା କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ଭାଷାଭିତ୍ତିକ ପ୍ରଥମ ରାଜ୍ୟ ଭାବରେ ୧୯୩୬ ଏପ୍ରିଲ ୧ ରେ ଓଡ଼ିଶା ଗଠିତ ହୋଇଥିଲା।',
    categoryOdia: 'ଇତିହାସ'
  },
  {
    id: 'lq-4',
    question: 'ଓମ୍‌ଙ୍କ ନିୟମ ଅନୁସାରେ V = I ÷ R କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'ମିଛ! ଓମ୍‌ଙ୍କ ନିୟମ ଅନୁସାରେ V = IR (ବିଭବାନ୍ତର = ବିଦ୍ୟୁତ୍ ସ୍ରୋତ × ପ୍ରତିରୋଧ)।',
    categoryOdia: 'ବିଜ୍ଞାନ'
  },
  {
    id: 'lq-5',
    question: 'ସମାନ୍ତର ପ୍ରଗତି (AP) ରେ ସାଧାରଣ ଅନ୍ତର d ଶୂନ (0) ହୋଇପାରେ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ସମସ୍ତ ପଦ ସମାନ ହେଲେ (ଯଥା: ୫, ୫, ୫...) ସାଧାରଣ ଅନ୍ତର d = 0 ହୁଏ।',
    categoryOdia: 'ଗଣିତ'
  },
  {
    id: 'lq-6',
    question: 'In English grammar, "Neither of the boys were present" is correct?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'ମିଛ! "Neither of" ସର୍ବଦା ଏକବଚନ (singular verb) ନିଏ: "Neither of the boys was present"।',
    categoryOdia: 'English'
  },
  {
    id: 'lq-7',
    question: 'ଜୀବକୋଷରେ ଗ୍ଲାଇକୋଲିସିସ୍ ପ୍ରକ୍ରିୟା କୋଷଜୀବକ (Cytoplasm) ରେ ସଂଘଟିତ ହୁଏ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ଗ୍ଲାଇକୋଲିସିସ୍ କୋଷଜୀବକରେ ହୁଏ ଏବଂ କ୍ରେବ୍ସ ଚକ୍ର ମାଇଟୋକଣ୍ଡ୍ରିଆରେ ହୁଏ।',
    categoryOdia: 'ଜୀବ ବିଜ୍ଞାନ'
  },
  {
    id: 'lq-8',
    question: 'ସମତଳ ଦର୍ପଣରେ ସୃଷ୍ଟି ହେଉଥିବା ପ୍ରତିବିମ୍ବ ବାସ୍ତବ ଓ ଓଲଟା ହୁଏ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'ମିଛ! ସମତଳ ଦର୍ପଣରେ ଆଭାସୀ (Virtual) ଓ ଖୋଳା/ସିଧା (Erect) ପ୍ରତିବିମ୍ବ ଗଠନ ହୁଏ।',
    categoryOdia: 'ବିଜ୍ଞାନ'
  },
  {
    id: 'lq-9',
    question: 'ହିରାକୁଦ ନଦୀବନ୍ଧ ଓଡ଼ିଶାର ବ୍ରାହ୍ମଣୀ ନଦୀ ଉପରେ ନିର୍ମିତ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'ମିଛ! ହୀରାକୁଦ ଭାରତର ସର୍ବବୃହତ୍ ନଦୀବନ୍ଧ ଯାହା ସମ୍ବଲପୁରର ମହାନଦୀ ଉପରେ ଅବସ୍ଥିତ।',
    categoryOdia: 'ଭୂଗୋଳ'
  },
  {
    id: 'lq-10',
    question: 'ତ୍ରିକୋଣମିତିରେ sin 90° ର ମାନ ୧ (One) କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ସଠିକ୍! sin 0° = 0 ଏବଂ sin 90° = 1।',
    categoryOdia: 'ଗଣିତ'
  },
  {
    id: 'lq-11',
    question: 'ଉତ୍କଳ ଗୌରବ ମଧୁସୂଦନ ଦାସ ୧୯୦୩ ମସିହାରେ ଉତ୍କଳ ସମ୍ମିଳନୀ ପ୍ରତିଷ୍ଠା କରିଥିଲେ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ମଧୁବାବୁଙ୍କ ନେତୃତ୍ୱରେ ୧୯୦୩ ରେ କଟକଠାରେ ଉତ୍କଳ ସମ୍ମିଳନୀ ଗଠିତ ହୋଇଥିଲା।',
    categoryOdia: 'ଇତିହାସ'
  },
  {
    id: 'lq-12',
    question: 'ଉଦ୍ଭିଦରେ ଫ୍ଲୋଏମ୍ ଟିସୁ ଜଳ ପରିବହନ କରେ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'ମିଛ! ଜାଇଲେମ୍ (Xylem) ଜଳ ପରିବହନ କରେ ଏବଂ ଫ୍ଲୋଏମ୍ (Phloem) ଖାଦ୍ୟ ପରିବହନ କରେ।',
    categoryOdia: 'ଜୀବ ବିଜ୍ଞାନ'
  },
  {
    id: 'lq-13',
    question: 'ପ୍ରଭେଦକ D < 0 ହେଲେ ଦ୍ୱିଘାତ ସମୀକରଣର ମୂଳଦ୍ୱୟ ବାସ୍ତବ ହୁଏ ନାହିଁ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ସତ! D < 0 ହେଲେ କୌଣସି ବାସ୍ତବ ମୂଳ (No real roots) ନଥାଏ।',
    categoryOdia: 'ଗଣିତ'
  },
  {
    id: 'lq-14',
    question: 'Lencho was a greedy trader in the story "A Letter to God"?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'False! Lencho was a simple and hardworking farmer who had immense faith in God.',
    categoryOdia: 'English'
  },
  {
    id: 'lq-15',
    question: 'ମନୁଷ୍ୟ ହୃତ୍‌ପିଣ୍ଡରେ ୪ ଟି କୋଠରୀ (୨ ଅଳିନ୍ଦ ଓ ୨ ନିଳୟ) ଥାଏ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ମାନବ ହୃତପିଣ୍ଡ ଚାରି-ପ୍ରକୋଷ୍ଠ ବିଶିଷ୍ଟ।',
    categoryOdia: 'ବିଜ୍ଞାନ'
  },
  {
    id: 'lq-16',
    question: 'ବୃତ୍ତର ଏକ ଛେଦକ ରେଖା ବୃତ୍ତକୁ ଗୋଟିଏ ବିନ୍ଦୁରେ ହିଁ ସ୍ପର୍ଶ କରେ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 1,
    explanation: 'ମିଛ! ସ୍ପର୍ଶକ ଗୋଟିଏ ବିନ୍ଦୁରେ ସ୍ପର୍ଶ କରେ, ଛେଦକ (Secant) ଦୁଇଟି ବିନ୍ଦୁରେ ଛେଦ କରେ।',
    categoryOdia: 'ଗଣିତ'
  },
  {
    id: 'lq-17',
    question: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିରକୁ ୟୁନେସ୍କୋ (UNESCO) ବିଶ୍ୱ ଐତିହ୍ୟ ତାଲିକାରେ ସ୍ଥାନିତ କରିଛି କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ୧୯୮୪ ମସିହାରେ କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିରକୁ UNESCO ବିଶ୍ୱ ଐତିହ୍ୟ ସ୍ଥଳ ଘୋଷଣା କରାଯାଇଛି।',
    categoryOdia: 'ଇତିହାସ'
  },
  {
    id: 'lq-18',
    question: 'ନିମ୍ନଲିଖିତ ମଧ୍ୟରୁ କେଉଁଟି ନବୀକରଣ ଯୋଗ୍ୟ ସମ୍ବଳ?',
    options: ['ସୌର ଶକ୍ତି (Solar Energy)', 'ପେଟ୍ରୋଲିୟମ୍ (Petroleum)'],
    correctIndex: 0,
    explanation: 'ସୌର ଶକ୍ତି ଏକ ଅସରନ୍ତି ଓ ନବୀକରଣ ଯୋଗ୍ୟ ସମ୍ବଳ। ପେଟ୍ରୋଲିୟମ ସୀମିତ ଅଟେ।',
    categoryOdia: 'ଭୂଗୋଳ'
  },
  {
    id: 'lq-19',
    question: 'ଭାରତର ପ୍ରଥମ ରାଷ୍ଟ୍ରପତି ଡାକ୍ତର ରାଜେନ୍ଦ୍ର ପ୍ରସାଦ ଥିଲେ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ଡକ୍ଟର ରାଜେନ୍ଦ୍ର ପ୍ରସାଦ ସ୍ୱାଧୀନ ଭାରତର ପ୍ରଥମ ରାଷ୍ଟ୍ରପତି ଥିଲେ।',
    categoryOdia: 'ଇତିହାସ'
  },
  {
    id: 'lq-20',
    question: 'କବି କୁନ୍ତଳା କୁମାରୀ ସାବତଙ୍କୁ "ଉତ୍କଳ ଭାରତୀ" କୁହାଯାଏ କି?',
    options: ['ସତ (True)', 'ମିଛ (False)'],
    correctIndex: 0,
    explanation: 'ହଁ, ୧୯୨୫ ରେ ମହିଳା କବି କୁନ୍ତଳା କୁମାରୀ ସାବତଙ୍କୁ "ଉତ୍କଳ ଭାରତୀ" ଉପାଧିରେ ସମ୍ମାନିତ କରାଯାଇଥିଲା।',
    categoryOdia: 'ସାହିତ୍ୟ'
  }
];
