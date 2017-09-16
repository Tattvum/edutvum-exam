const Validator = require('jsonschema').Validator
const validator = new Validator()

let ok = true

const questionSchema = {
  'id': '/QuestionSchema',
  'type': 'object',
  'properties': {
    'display': { 'type': 'string' },
    'type': { 'type': 'string', 'enum': ['TFQ', 'ARQ', 'MCQ', 'MAQ', 'NCQ'] },
    'choices': { 'type': 'array', 'items': { 'type': 'string' } },
    'solutions': { 'type': 'array', 'items': { 'type': 'number' } },
    'notes': { 'type': 'string' },
  },
  'dependencies': {
    'choices': { 'properties': { 'type': { 'enum': ['MCQ', 'MAQ'] } } }
  },
  'additionalProperties': false,
  'required': ['display', 'type', 'solutions']
}
validator.addSchema(questionSchema, '/QuestionSchema');

const examSchema = {
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
validator.addSchema(examSchema, '/ExamSchema')

export const resultSchema = {
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
validator.addSchema(resultSchema, '/ResultSchema')

const ver5Schema = {
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

export class SchemaValidations {
  public static validate(data): boolean {
    let errors = validator.validate(data, ver5Schema).errors
    errors.forEach(err => {
      console.log(err.stack)
    })
    return (errors == null || errors.length <= 0)
  }
}