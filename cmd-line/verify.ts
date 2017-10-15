import { SchemaValidations } from './schema.validations'
import { QidValidations } from './qid.validations'
import { QuestionValidations } from './question.validations'
import { QuestionLinkValidations } from './question-link.validations'
import { SolutionValidations } from './solution.validations'
import { DataLib } from './library'
import * as fs from 'jsonfile';

const __JSON_FILE__ = process.argv[2]
console.log('reading...', __JSON_FILE__)
console.log('.')
const data: any = fs.readFileSync(__JSON_FILE__, 'utf8')

function validate(category, cls) {
  let ok = cls.validate(data)
  if (ok) console.log(category + ' Validations succesful.')
  else console.log(category + ' Validations FAILED!')
}

validate('Schema', SchemaValidations)
validate('Qid', QidValidations)
validate('Question', QuestionValidations)
// validate('QuestionLink', QuestionLinkValidations)
// validate('Solution', SolutionValidations)
