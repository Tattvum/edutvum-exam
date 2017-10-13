import * as fs from 'jsonfile';
const Validator = require('jsonschema').Validator
const validator = new Validator()

let ok = true

const __JSON_SCHEMA_FILE__ = 'cmd-line/edutvum-exam-schema.json'
console.log('reading...', __JSON_SCHEMA_FILE__)
console.log('.')
let ver5Schemafs: any = fs.readFileSync(__JSON_SCHEMA_FILE__, 'utf8')

export class SchemaValidations {
  public static validate(data): boolean {
    let errors = validator.validate(data, ver5Schemafs).errors
    errors.forEach(err => {
      console.log(err.stack)
    })
    return (errors == null || errors.length <= 0)
  }
}
