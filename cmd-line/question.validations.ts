import { DataLib } from './library'

let ok = true

function evenx(x) {
  return x.filter((_, i) => i % 2 === 0)
}

function displayErrors(typ: string, ...x) {
  ok = false
  console.log('bad ' + typ + ':', ...evenx(x))
}

function checkQid(...ctx) {
  // console.log(...ctx)
  let qid = ctx[2]
  let regex = new RegExp('(.+)q([0-9]+)(.*)')
  let part = regex.exec(qid)
  if (part && part.length >= 3) {
    if (DataLib.n2s(+part[2]) !== part[2]) displayErrors('qid format', ...ctx)
  } else displayErrors('qid format', ...ctx)
}

export class QuestionValidations {
  public static validate(data): boolean {
    DataLib.drill({
      t: [o => o.questions, o => o],
      e: [o => [], o => [o, '.'], o => []],
      last: (...x) => {
        checkQid(...x)
        let q = x[1]
        let type = q.type
        if ((type === 'MCQ' || type === 'MAQ') && q.choices == null) {
          displayErrors('- choices missing', ...x)
        }
      },
    }, data.ver5.exams)
    return ok
  }
}
