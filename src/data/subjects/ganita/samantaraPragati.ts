import { Chapter } from '../../types';

export const samantaraPragatiChapter: Chapter = {
  "id": "math-samantara-pragati",
  "title": "ସମାନ୍ତର ପ୍ରଗତି (A.P.)",
  "subtitle": "ବୀଜଗଣିତ: ପ୍ରଥମ ପଦ a, ସାଧାରଣ ଅନ୍ତର d, n-ତମ ପଦ tₙ ଓ ସମଷ୍ଟି Sₙ",
  "questionCount": 20,
  "estimatedMinutes": 10,
  "questions": [
    {
      "id": "sp-q1",
      "question": "ସମାନ୍ତର ପ୍ରଗତି (Arithmetic Progression - AP) ର ସାଧାରଣ ଅନ୍ତର (d) ର ସଂଜ୍ଞା କ'ଣ?",
      "options": [
        "d = tₙ - tₙ₋₁",
        "d = tₙ / tₙ₋₁",
        "d = tₙ + tₙ₋₁",
        "d = tₙ × tₙ₋₁"
      ],
      "correctIndex": 0,
      "explanation": "ପରବର୍ତ୍ତୀ ପଦରୁ ପୂର୍ବ ପଦ ବିୟୋଗ କଲେ ସାଧାରଣ ଅନ୍ତର d ମିଳେ।"
    },
    {
      "id": "sp-q2",
      "question": "ଏକ AP ର ପ୍ରଥମ ପଦ a ଏବଂ ସାଧାରଣ ଅନ୍ତର d ହେଲେ n-ତମ ପଦ (tₙ) ର ସୂତ୍ର କ'ଣ?",
      "options": [
        "tₙ = a + nd",
        "tₙ = a + (n - 1)d",
        "tₙ = a - (n - 1)d",
        "tₙ = an + d"
      ],
      "correctIndex": 1,
      "explanation": "AP ର n-ତମ ପଦ: tₙ = a + (n - 1)d ଅଟେ।"
    },
    {
      "id": "sp-q3",
      "question": "ଏକ AP ର ପ୍ରଥମ n ସଂଖ୍ୟକ ପଦର ସମଷ୍ଟି (Sₙ) ର ସୂତ୍ର କ'ଣ?",
      "options": [
        "Sₙ = n/2 [a + (n - 1)d]",
        "Sₙ = n [a + (n - 1)d]",
        "Sₙ = n/2 [2a + (n - 1)d]",
        "Sₙ = 2n [a + d]"
      ],
      "correctIndex": 2,
      "explanation": "ସମଷ୍ଟି ସୂତ୍ର: Sₙ = n/2 [2a + (n - 1)d] = n/2 [a + l], ଯେଉଁଠି l ଶେଷ ପଦ।"
    },
    {
      "id": "sp-q4",
      "question": "ପ୍ରଗତି 2, 7, 12, 17, ... ର ୧୦-ତମ ପଦ କେତେ?",
      "options": [
        "50",
        "45",
        "52",
        "47"
      ],
      "correctIndex": 3,
      "explanation": "a = 2, d = 7 - 2 = 5 | t₁₀ = 2 + (10 - 1)5 = 2 + 45 = 47।"
    },
    {
      "id": "sp-q5",
      "question": "ପ୍ରଥମ n ସଂଖ୍ୟକ ସ୍ୱାଭାବିକ ସଂଖ୍ୟାର ଯୋଗଫଳ (1 + 2 + 3 + ... + n) କେତେ?",
      "options": [
        "n(n + 1) / 2",
        "n(n - 1) / 2",
        "n²",
        "n(n + 1)"
      ],
      "correctIndex": 0,
      "explanation": "ପ୍ରଥମ n ସ୍ୱାଭାବିକ ସଂଖ୍ୟାର ସମଷ୍ଟି = n(n + 1) / 2।"
    },
    {
      "id": "sp-q6",
      "question": "ପ୍ରଥମ n ସଂଖ୍ୟକ ଅଯୁଗ୍ମ ସ୍ୱାଭାବିକ ସଂଖ୍ୟାର ଯୋଗଫଳ (1 + 3 + 5 + ... + (2n-1)) କେତେ?",
      "options": [
        "n(n + 1)",
        "n²",
        "2n²",
        "n² - 1"
      ],
      "correctIndex": 1,
      "explanation": "ପ୍ରଥମ n ଅଯୁଗ୍ମ ସଂଖ୍ୟାର ସମଷ୍ଟି ସର୍ବଦା n² ହୋଇଥାଏ।"
    },
    {
      "id": "sp-q7",
      "question": "ପ୍ରଥମ n ସଂଖ୍ୟକ ଯୁଗ୍ମ ସ୍ୱାଭାବିକ ସଂଖ୍ୟାର ଯୋଗଫଳ (2 + 4 + 6 + ... + 2n) କେତେ?",
      "options": [
        "n(n - 1)",
        "n²",
        "n(n + 1)",
        "2n²"
      ],
      "correctIndex": 2,
      "explanation": "ପ୍ରଥମ n ଯୁଗ୍ମ ସଂଖ୍ୟାର ସମଷ୍ଟି = n(n + 1)।"
    },
    {
      "id": "sp-q8",
      "question": "ଯଦି a, b, c ଏକ AP ରେ ଥାଆନ୍ତି, ତେବେ ସେମାନଙ୍କ ମଧ୍ୟରେ କେଉଁ ସମ୍ପର୍କ ସତ୍ୟ?",
      "options": [
        "b = a - c",
        "b² = ac",
        "a + b = c",
        "2b = a + c (b = (a + c)/2)"
      ],
      "correctIndex": 3,
      "explanation": "ସାଧାରଣ ଅନ୍ତର ସମାନ: b - a = c - b => 2b = a + c | b କୁ a ଓ c ର ସମାନ୍ତର ମଧ୍ୟକ (A.M.) କୁହାଯାଏ।"
    },
    {
      "id": "sp-q9",
      "question": "ପ୍ରଗତି 21, 18, 15, ... ର କେଉଁ ପଦଟି ଶୂନ (0)?",
      "options": [
        "୮-ତମ ପଦ (8th term)",
        "୭-ତମ ପଦ",
        "୯-ତମ ପଦ",
        "୧୦-ତମ ପଦ"
      ],
      "correctIndex": 0,
      "explanation": "a = 21, d = -3 | tₙ = 0 => 21 + (n - 1)(-3) = 0 => 3(n - 1) = 21 => n - 1 = 7 => n = 8।"
    },
    {
      "id": "sp-q10",
      "question": "ଯଦି ଏକ AP ର ୩ୟ ପଦ 5 ଏବଂ ୭ମ ପଦ 9 ହୁଏ, ତେବେ ସାଧାରଣ ଅନ୍ତର d କେତେ?",
      "options": [
        "2",
        "1",
        "3",
        "4"
      ],
      "correctIndex": 1,
      "explanation": "t₇ - t₃ = 4d => 9 - 5 = 4 => 4d = 4 => d = 1।"
    },
    {
      "id": "sp-q11",
      "question": "ସମାନ୍ତର ପ୍ରଗତି 3, 8, 13, ..., 253 ର ଶେଷ ଆଡ଼ୁ ୨୦-ତମ ପଦ କେତେ?",
      "options": [
        "153",
        "163",
        "158",
        "148"
      ],
      "correctIndex": 2,
      "explanation": "ଶେଷରୁ l = 253, d = 5 | ଶେଷ ଆଡୁ n-ତମ ପଦ = l - (n - 1)d = 253 - (20 - 1)5 = 253 - 95 = 158।"
    },
    {
      "id": "sp-q12",
      "question": "1 ରୁ 100 ମଧ୍ୟରେ ଥିବା ସମସ୍ତ ସ୍ୱାଭାବିକ ସଂଖ୍ୟାର ଯୋଗଫଳ କେତେ?",
      "options": [
        "4950",
        "5000",
        "5100",
        "5050"
      ],
      "correctIndex": 3,
      "explanation": "S₁₀₀ = 100(101) / 2 = 50 × 101 = 5050।"
    },
    {
      "id": "sp-q13",
      "question": "ଯଦି Sₙ = 3n² + 5n ହୁଏ, ତେବେ ପ୍ରଥମ ପଦ (t₁ = S₁) କେତେ?",
      "options": [
        "8",
        "3",
        "5",
        "11"
      ],
      "correctIndex": 0,
      "explanation": "t₁ = S₁ = 3(1)² + 5(1) = 3 + 5 = 8।"
    },
    {
      "id": "sp-q14",
      "question": "Sₙ ଦିଆଯାଇଥିଲେ n-ତମ ପଦ (tₙ) ନିର୍ଣ୍ଣୟ କରିବାର ସୂତ୍ର କ'ଣ?",
      "options": [
        "tₙ = Sₙ + Sₙ₋₁",
        "tₙ = Sₙ - Sₙ₋₁",
        "tₙ = Sₙ / n",
        "tₙ = Sₙ - S₁"
      ],
      "correctIndex": 1,
      "explanation": "ପ୍ରଥମ n ପଦର ସମଷ୍ଟିରୁ ପ୍ରଥମ (n-1) ପଦର ସମଷ୍ଟି ଫେଡ଼ିଲେ n-ତମ ପଦ ମିଳେ।"
    },
    {
      "id": "sp-q15",
      "question": "ଏକ AP ର ତିନୋଟି କ୍ରମିକ ପଦ ଧରିବା ପାଇଁ ସବୁଠାରୁ ସୁବିଧାଜନକ ରୂପ କ'ଣ?",
      "options": [
        "a, ar, ar²",
        "a, a + d, a + 2d",
        "a - d, a, a + d",
        "a - 2d, a, a + 2d"
      ],
      "correctIndex": 2,
      "explanation": "a - d, a, a + d ଧରିଲେ ସେମାନଙ୍କ ଯୋଗଫଳ ସହଜରେ 3a ହୋଇଯାଏ।"
    },
    {
      "id": "sp-q16",
      "question": "ଦୁଇ ଅଙ୍କ ବିଶିଷ୍ଟ କେତୋଟି ସଂଖ୍ୟା 3 ଦ୍ୱାରା ବିଭାଜ୍ୟ?",
      "options": [
        "27 ଟି",
        "33 ଟି",
        "25 ଟି",
        "30 ଟି (12, 15, ..., 99)"
      ],
      "correctIndex": 3,
      "explanation": "ପ୍ରଥମ 12, ଶେଷ 99 | 99 = 12 + (n - 1)3 => 87 = 3(n - 1) => n - 1 = 29 => n = 30।"
    },
    {
      "id": "sp-q17",
      "question": "ପ୍ରଗତି 7, 13, 19, ..., 205 ରେ ମୋଟ କେତୋଟି ପଦ ଅଛି?",
      "options": [
        "34 ଟି",
        "33 ଟି",
        "35 ଟି",
        "32 ଟି"
      ],
      "correctIndex": 0,
      "explanation": "205 = 7 + (n - 1)6 => 198 = 6(n - 1) => n - 1 = 33 => n = 34।"
    },
    {
      "id": "sp-q18",
      "question": "ଗୋଟିଏ AP ର ସାଧାରଣ ଅନ୍ତର କେଉଁ ପ୍ରକାରର ହୋଇପାରେ?",
      "options": [
        "କେବଳ ଧନାତ୍ମକ",
        "ଧନାତ୍ମକ, ଋଣାତ୍ମକ କିମ୍ବା ଶୂନ",
        "କେବଳ ପୂର୍ଣ୍ଣସଂଖ୍ୟା",
        "ସର୍ବଦା 1"
      ],
      "correctIndex": 1,
      "explanation": "ସାଧାରଣ ଅନ୍ତର d ଯେକୌଣସି ବାସ୍ତବ ସଂଖ୍ୟା (ଧନାତ୍ମକ, ଋଣାତ୍ମକ ବା ଶୂନ୍ୟ) ହୋଇପାରେ।"
    },
    {
      "id": "sp-q19",
      "question": "4 ଏବଂ 20 ମଧ୍ୟରେ ସମାନ୍ତର ମଧ୍ୟକ (Arithmetic Mean) କେତେ?",
      "options": [
        "10",
        "16",
        "12",
        "8"
      ],
      "correctIndex": 2,
      "explanation": "A.M. = (a + c) / 2 = (4 + 20) / 2 = 24 / 2 = 12।"
    },
    {
      "id": "sp-q20",
      "question": "ଗୋଟିଏ AP ର ପ୍ରଥମ ପଦ 1 ଏବଂ ଶେଷ ପଦ 11, ସମଷ୍ଟି 36 ହେଲେ ପଦ ସଂଖ୍ୟା n କେତେ?",
      "options": [
        "8",
        "5",
        "7",
        "6"
      ],
      "correctIndex": 3,
      "explanation": "Sₙ = n/2 (a + l) => 36 = n/2 (1 + 11) => 36 = n/2 × 12 => 36 = 6n => n = 6।"
    }
  ]
};
