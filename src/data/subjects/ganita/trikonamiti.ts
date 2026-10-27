import { Chapter } from '../../types';

export const trikonamitiChapter: Chapter = {
  "id": "math-trikonamiti",
  "title": "ତ୍ରିକୋଣମିତି (Trigonometry)",
  "subtitle": "ଜ୍ୟାମିତି: sin, cos, tan ସମ୍ପର୍କ, ଅନୁପୂରକ କୋଣ, ଅଭେଦ ଓ ଉଚ୍ଚତା-ଦୂରତା",
  "questionCount": 20,
  "estimatedMinutes": 10,
  "questions": [
    {
      "id": "tri-q1",
      "question": "ମୂଳ ତ୍ରିକୋଣମିତିକ ଅଭେଦ (Trigonometric Identity) ଅନୁସାରେ sin²θ + cos²θ = କେତେ?",
      "options": [
        "1",
        "0",
        "2",
        "-1"
      ],
      "correctIndex": 0,
      "explanation": "ପାଇଥାଗୋରାସ୍ ସମ୍ପର୍କରୁ: sin²θ + cos²θ = (p/h)² + (b/h)² = (p² + b²)/h² = 1।"
    },
    {
      "id": "tri-q2",
      "question": "1 + tan²θ ର ସମତୁଲ୍ୟ ତ୍ରିକୋଣମିତିକ ମାନ କ'ଣ?",
      "options": [
        "cosec²θ",
        "sec²θ",
        "cot²θ",
        "sin²θ"
      ],
      "correctIndex": 1,
      "explanation": "ଅଭେଦ: sec²θ - tan²θ = 1 => 1 + tan²θ = sec²θ।"
    },
    {
      "id": "tri-q3",
      "question": "1 + cot²θ ର ସମତୁଲ୍ୟ ତ୍ରିକୋଣମିତିକ ମାନ କ'ଣ?",
      "options": [
        "tan²θ",
        "sec²θ",
        "cosec²θ",
        "cos²θ"
      ],
      "correctIndex": 2,
      "explanation": "ଅଭେଦ: cosec²θ - cot²θ = 1 => 1 + cot²θ = cosec²θ।"
    },
    {
      "id": "tri-q4",
      "question": "sin 30° ର ସଠିକ୍ ମାନ କେତେ?",
      "options": [
        "1",
        "√3/2",
        "1/√2",
        "1/2"
      ],
      "correctIndex": 3,
      "explanation": "sin 30° = 1/2 ଏବଂ cos 60° = 1/2।"
    },
    {
      "id": "tri-q5",
      "question": "cos 45° ଏବଂ sin 45° ଉଭୟଙ୍କ ମାନ କେତେ?",
      "options": [
        "1/√2",
        "1/2",
        "√3/2",
        "1"
      ],
      "correctIndex": 0,
      "explanation": "୪୫° କୋଣରେ ସମକୋଣୀ ସମଦ୍ୱିବାହୁ ତ୍ରିଭୁଜ ହେତୁ sin 45° = cos 45° = 1/√2।"
    },
    {
      "id": "tri-q6",
      "question": "tan 45° ର ମାନ କେତେ?",
      "options": [
        "0",
        "1",
        "√3",
        "1/√3"
      ],
      "correctIndex": 1,
      "explanation": "tan 45° = sin 45° / cos 45° = 1।"
    },
    {
      "id": "tri-q7",
      "question": "tan 60° ର ମାନ କେତେ?",
      "options": [
        "1",
        "1/√3",
        "√3",
        "ଅସଂଜ୍ଞାୟିତ"
      ],
      "correctIndex": 2,
      "explanation": "tan 60° = sin 60° / cos 60° = (√3/2) / (1/2) = √3।"
    },
    {
      "id": "tri-q8",
      "question": "ଅନୁପୂରକ କୋଣ ସୂତ୍ର ଅନୁସାରେ sin(90° - θ) = କେତେ?",
      "options": [
        "tan θ",
        "sin θ",
        "-cos θ",
        "cos θ"
      ],
      "correctIndex": 3,
      "explanation": "ସମକୋଣୀ ତ୍ରିଭୁଜରେ ଅନୁପୂରକ ସମ୍ପର୍କ: sin(90° - θ) = cos θ।"
    },
    {
      "id": "tri-q9",
      "question": "tan(90° - θ) = କେତେ?",
      "options": [
        "cot θ",
        "tan θ",
        "sec θ",
        "-cot θ"
      ],
      "correctIndex": 0,
      "explanation": "tan(90° - θ) = cot θ ଏବଂ cot(90° - θ) = tan θ।"
    },
    {
      "id": "tri-q10",
      "question": "sec(90° - θ) = କେତେ?",
      "options": [
        "sec θ",
        "cosec θ",
        "cos θ",
        "sin θ"
      ],
      "correctIndex": 1,
      "explanation": "sec(90° - θ) = cosec θ।"
    },
    {
      "id": "tri-q11",
      "question": "sin 18° / cos 72° ର ମାନ କେତେ?",
      "options": [
        "1/2",
        "0",
        "1",
        "2"
      ],
      "correctIndex": 2,
      "explanation": "cos 72° = cos(90° - 18°) = sin 18° | ତେଣୁ sin 18° / sin 18° = 1।"
    },
    {
      "id": "tri-q12",
      "question": "tan 10° · tan 80° ର ମାନ କେତେ?",
      "options": [
        "-1",
        "0",
        "√3",
        "1"
      ],
      "correctIndex": 3,
      "explanation": "tan 80° = cot 10° | tan 10° × cot 10° = 1।"
    },
    {
      "id": "tri-q13",
      "question": "sin(180° - θ) ର ମାନ କେତେ?",
      "options": [
        "sin θ",
        "-sin θ",
        "cos θ",
        "-cos θ"
      ],
      "correctIndex": 0,
      "explanation": "ଦ୍ୱିତୀୟ ପାଦ (2nd Quadrant) ରେ ସାଇନ୍ ଧନାତ୍ମକ ଥାଏ: sin(180° - θ) = sin θ।"
    },
    {
      "id": "tri-q14",
      "question": "cos(180° - θ) ର ମାନ କେତେ?",
      "options": [
        "cos θ",
        "-cos θ",
        "sin θ",
        "-sin θ"
      ],
      "correctIndex": 1,
      "explanation": "ଦ୍ୱିତୀୟ ପାଦରେ କୋସାଇନ୍ ଋଣାତ୍ମକ: cos(180° - θ) = -cos θ।"
    },
    {
      "id": "tri-q15",
      "question": "ତଳୁ ଉପରକୁ ଥିବା ବସ୍ତୁକୁ ଦେଖିବା ବେଳେ ଦୃଷ୍ଟିରେଖା ଓ ଭୂସମାନ୍ତର ରେଖା ମଧ୍ୟରେ ଉତ୍ପନ୍ନ କୋଣକୁ କ'ଣ କୁହାଯାଏ?",
      "options": [
        "ସରଳ କୋଣ",
        "ଅବନତି କୋଣ (Angle of Depression)",
        "ଉନ୍ନତି କୋଣ (Angle of Elevation)",
        "ପରିପୂରକ କୋଣ"
      ],
      "correctIndex": 2,
      "explanation": "ଦ୍ରଷ୍ଟା ମୁଣ୍ଡ ଟେକି ଉପରକୁ ଚାହିଁଲେ ସୃଷ୍ଟି ହେଉଥିବା କୋଣକୁ ଉନ୍ନତି କୋଣ କୁହାଯାଏ।"
    },
    {
      "id": "tri-q16",
      "question": "ଉପରୁ ତଳକୁ ଥିବା ବସ୍ତୁକୁ ଦେଖିବା ବେଳେ ସୃଷ୍ଟି ହେଉଥିବା କୋଣକୁ କ'ଣ କୁହାଯାଏ?",
      "options": [
        "ଶୀର୍ଷକୋଣ",
        "ଉନ୍ନତି କୋଣ",
        "ବୃହତ କୋଣ",
        "ଅବନତି କୋଣ (Angle of Depression)"
      ],
      "correctIndex": 3,
      "explanation": "ଉଚ୍ଚ ସ୍ଥାନରୁ ତଳକୁ ଚାହିଁଲେ ଦୃଷ୍ଟିରେଖା ଭୂସମାନ୍ତର ସହ ଅବନତି କୋଣ ସୃଷ୍ଟି କରେ।"
    },
    {
      "id": "tri-q17",
      "question": "ଗୋଟିଏ ଖୁଣ୍ଟର ଉଚ୍ଚତା ଓ ତାର ଛାଇର ଦୈର୍ଘ୍ୟ ସମାନ ହେଲେ ସୂର୍ଯ୍ୟଙ୍କ ଉନ୍ନତି କୋଣ କେତେ ଡିଗ୍ରୀ?",
      "options": [
        "45°",
        "30°",
        "60°",
        "90°"
      ],
      "correctIndex": 0,
      "explanation": "tan θ = ଉଚ୍ଚତା / ଛାଇ = h / h = 1 => θ = 45°।"
    },
    {
      "id": "tri-q18",
      "question": "ଏକ ଟାୱାରର ପାଦଦେଶରୁ 30 ମିଟର ଦୂରରେ ଥିବା ଏକ ବିନ୍ଦୁରୁ ଚୂଡ଼ାର ଉନ୍ନତି କୋଣ 30° | ଟାୱାରର ଉଚ୍ଚତା କେତେ?",
      "options": [
        "30√3 ମିଟର",
        "10√3 ମିଟର",
        "15 ମିଟର",
        "20 ମିଟର"
      ],
      "correctIndex": 1,
      "explanation": "tan 30° = h / 30 => 1/√3 = h / 30 => h = 30 / √3 = 10√3 ମିଟର।"
    },
    {
      "id": "tri-q19",
      "question": "ଯଦି sin θ = 3/5 ହୁଏ, ତେବେ cos θ ର ମାନ କେତେ?",
      "options": [
        "3/4",
        "5/3",
        "4/5",
        "1/5"
      ],
      "correctIndex": 2,
      "explanation": "cos θ = √(1 - sin²θ) = √(1 - 9/25) = √(16/25) = 4/5।"
    },
    {
      "id": "tri-q20",
      "question": "(1 + cos θ)(1 - cos θ) ର ମାନ କେତେ?",
      "options": [
        "1",
        "cos²θ",
        "tan²θ",
        "sin²θ"
      ],
      "correctIndex": 3,
      "explanation": "(1 + cos θ)(1 - cos θ) = 1 - cos²θ = sin²θ।"
    }
  ]
};
