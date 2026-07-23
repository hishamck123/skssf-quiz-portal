const fs = require('fs');

const raw = fs.readFileSync('./public/islamic_malayalam_quiz_50.json');
const data = JSON.parse(raw);

const frontendQuestions = data.map(q => ({
  id: `q${q.id}`,
  text: q.question,
  options: q.options
}));

const backendAnswers = {};
data.forEach(q => {
  backendAnswers[`q${q.id}`] = q.options[q.correctAnswer];
});

fs.writeFileSync('./src/utils/questions.ts', 
  `export interface Question {\n  id: string;\n  text: string;\n  options: string[];\n}\n\nexport const quizQuestions: Question[] = ${JSON.stringify(frontendQuestions, null, 2)};\n`
);

fs.writeFileSync('./backend_answers.json', JSON.stringify(backendAnswers, null, 2));

console.log("Processing complete!");
