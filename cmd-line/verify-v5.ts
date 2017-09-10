import * as fs from 'jsonfile';

let Validator = require('jsonschema').Validator;
let v = new Validator();

let questionSchema = {
  'id': '/QuestionSchema',
  'type': 'object',
  'properties': {
    'display': { 'type': 'string' },
    'type': { 'type': 'string', 'enum': ['TFQ', 'ARQ', 'MCQ', 'MAQ', 'NCQ'] },
    'choices': { 'type': 'array', 'items': { 'type': 'string' } },
    'solutions': { 'type': 'array', 'items': { 'type': 'number' } },
    'notes': { 'type': 'string' },
  },
  'additionalProperties': false,
  'required': ['display', 'type', 'solutions']
}
v.addSchema(questionSchema, '/QuestionSchema');

let examSchema = {
  'id': '/ExamSchema',
  'type': 'object',
  'properties': {
    'name': { 'type': 'string' },
    'by': { 'type': 'string' },
    'notes': { 'type': 'string' },
    'when': { 'type': 'string', 'pattern': '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' },
    'revwhen': { 'type': 'string', 'pattern': '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' },
    'questions': {
      'type': 'object',
      'patternProperties': {
        '^[a-z0-9]+$': { '$ref': '/QuestionSchema' }
      },
      'additionalProperties': false,
    },
  },
  'additionalProperties': false,
  'required': ['name', 'by', 'when', 'revwhen', 'questions']
}
v.addSchema(examSchema, '/ExamSchema');

let resultSchema = {
  'id': '/ResultSchema',
  'type': 'object',
  'properties': {
    'exam': { 'type': 'string' },
    'when': { 'type': 'number' },
    'revwhen': { 'type': 'number' },
    'answers': {
      'type': 'object',
      'patternProperties': {
        '^[a-z0-9]+$': { 'type': 'array', 'items': { 'type': 'number' } }
      },
      'additionalProperties': false,
    },
    'guessings': {
      'type': 'object',
      'patternProperties': {
        '^[a-z0-9]+$': { 'type': 'boolean' }
      },
      'additionalProperties': false,
    },
  },
  'additionalProperties': false,
  'required': ['exam', 'when', 'revwhen']
}
v.addSchema(resultSchema, '/ResultSchema');

let ver5Schema = {
  'id': '/ver5Schema',
  'type': 'object',
  'properties': {
    'ver5': {
      'type': 'object',
      'properties': {
        'exams': {
          'type': 'object',
          'patternProperties': {
            '^[a-z0-9]+$': { '$ref': '/ExamSchema' },
          },
          'additionalProperties': false,
        },
        'results': {
          'type': 'object',
          'patternProperties': {
            '^[A-Za-z0-9]+$': {
              'type': 'object',
              'patternProperties': {
                '^[\\-\\w]+$': { '$ref': '/ResultSchema' },
              },
              'additionalProperties': false,
            },
          },
          'additionalProperties': false,
        },
      },
      'required': ['exams', 'results']
    }
  },
  'additionalProperties': false,
  'required': ['ver5']
}

let __JSON_FILE__ = process.argv[2]
console.log('reading...', __JSON_FILE__)
let data: any = fs.readFileSync(__JSON_FILE__, 'utf8')
let errors = v.validate(data, ver5Schema).errors
errors.forEach(err => {
  console.log(err.stack)
});

// ----- ----- ----- -----

function drill(f, o, n = 0, ...xs) {
  if (n >= f.t.length) { f.last(...xs); return }
  if (o) Object.keys(o).forEach((p, i) =>
    drill(f, f.t[n](o[p]), n + 1, ...xs, i, p, ...f.e[n](o[p])))
}

let n2s = (n: number) => {
  return ('0' + n).slice(-2);
}

let n9 = (d: string) => {
  if (d === '-') return d
  else return 9 - (+d)
}

let d2rev = (d: string) => {
  let dd = []
  d.split('').forEach(c => dd.push(n9(c)));
  return dd.join('')
}

// ----- ----- ----- -----

function checkQid(qid: string, ...ctx) {
  let regex = new RegExp('(.+)q([0-9]+)(.*)')
  let part = regex.exec(qid)
  if (part && part.length >= 3) {
    if (n2s(+part[2]) !== part[2]) console.log('BAD 1 qid ---- ', qid, ' -- ', ctx.join(', '))
  } else console.log('BAD 2 qid ---- ', qid, ' -- ', ctx.join(', '))
}

function drillQid(note, root, rfn, i) {
  console.log(note)
  drill({
    t: [o => o, rfn, o => o],
    e: [o => [], o => [o.exam], o => []],
    last: (...x) => checkQid(x[i], ...x),
  }, root)
}

if (!(errors && errors.length > 0)) {
  console.log('No structural errors. Yay!!')
  console.log('.')

  drillQid('results answers', data.ver5.results, o => o.answers, 6)
  console.log('.')

  drillQid('results guessings', data.ver5.results, o => o.guessings, 6)
  console.log('.')

  console.log('exams questions')
  drill({
    t: [o => o.questions, o => o],
    e: [o => [], o => []],
    last: (...x) => checkQid(x[3], ...x),
  }, data.ver5.exams)
  console.log('.')

  console.log('done.')
}

