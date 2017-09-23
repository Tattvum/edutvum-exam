import { DataLib } from './library'

let ok = true

function evenx(x) {
  return x.filter((_, i) => i % 2 === 0)
}

function displayErrors(typ: string, ...x) {
  ok = false
  console.log('bad ' + typ + ':', ...evenx(x))
}

let checkqid = (suffix, qmap, exam, x) => {
  if (qmap) {
    Object.keys(qmap).forEach(qid => {
      let q = exam.questions[qid]
      if (q == null) displayErrors('non existant qid in ' + suffix, qid, 'odd so dummy', ...x)
    })
  } // else displayErrors('---- no answers', ...x)
}

export class QidValidations {
  public static validate(data): boolean {
    DataLib.drill({
      t: [o => o, o => o],
      e: [o => [], o => [o, '@', o.answers, o.exam]],
      last: (...x) => {
        let eid = x[0]
        let exam = data.ver5.exams[eid]
        if (exam == null) displayErrors('non existant eid' + eid, ...x)
        else {
          checkqid('ans', x[3].answers, exam, x)
          checkqid('gus', x[3].guessings, exam, x)
          checkqid('dur', x[3].durations, exam, x)
        }
      },
    }, data.ver5.results)

    return ok
  }
}


