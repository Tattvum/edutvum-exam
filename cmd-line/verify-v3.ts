import fs = require('jsonfile');
let data: any = fs.readFileSync('exam-sample.json', 'utf8')

let exams = data.ver3.exams
let questions = data.ver3.questions

console.log("-----")

let Validator = require('jsonschema').Validator;
var v = new Validator();

let examSchema = {
  "id": "/ExamSchema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "by": { "type": "string" },
    "when": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
    "questions": { "type": "array", "items": { "type": "string" } },
  },
  "required": ["name", "by", "when", "questions"]
}
v.addSchema(examSchema, '/ExamSchema');

let questionSchema = {
  "id": "/QuestionSchema",
  "type": "object",
  "properties": {
    "display": { "type": "string" },
    "type": { "type": "string", "enum": ["TFQ", "ARQ", "MCQ", "MAQ"] },
    "choices": { "type": "array", "items": { "type": "string" } },
    "solutions": { "type": "array", "items": { "type": "number" } },
    "notes": { "type": "string" },
  },
  "required": ["display", "type", "solutions"]
}
v.addSchema(questionSchema, '/ExamSchema');

Object.keys(exams).forEach(id => {
  v.validate(exams[id], examSchema).errors.forEach(err => {
    console.log(id, err.stack)
  });
})

Object.keys(questions).forEach(qid => {
  v.validate(questions[qid], questionSchema).errors.forEach(err => {
    console.log(qid, err.stack)
  });
})

Object.keys(exams).forEach(eid => {
  let exam = exams[eid]
  let errors = v.validate(exam, examSchema).errors
  errors.forEach(err => console.log(eid, err.stack))
  if(errors.length == 0) {
    exam.questions.forEach(qid => {
      if(questions[qid] == null) console.log(eid, "missing", qid)
    });
  }
})
