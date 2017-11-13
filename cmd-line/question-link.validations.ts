import { DataLib } from './library'

let ok = true

function evenx(x) {
  return x.filter((_, i) => i % 2 === 0)
}

function displayErrors(typ: string, ...x) {
  ok = false
  console.log('bad ' + typ + ':', ...evenx(x))
}

export class QuestionLinkValidations {
  public static validate(data): boolean {
    DataLib.drill({
      t: [o => o.questions, o => o],
      e: [o => [], o => [o, '@']],
      last: (...x) => {
        let q = x[1]
        if (q.kind && q.kind === 'LINK') {
          let eid = q.eid
          let qid = q.qid
          let exam = data.ver5.exams[eid]
          if (exam == null) displayErrors('non existant exam ' + eid, ...x)
          else {
            let question = exam.questions[qid]
            if (question == null) displayErrors('non existant question ' + eid + '.' + qid, ...x)
          }
        }
      },
    }, data.ver5.exams)
    return ok
  }
}
