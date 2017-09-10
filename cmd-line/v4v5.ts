console.log(">>>>>>")
import fs = require('jsonfile');
let oldjs: any = fs.readFileSync('input.json', 'utf8')

let newjs = {
  'ver4': oldjs.ver4,
  'ver5': {
    'exams': oldjs.ver4.exams,
    'results': {}
  }
}

let exams = oldjs.ver4.exams
let users = oldjs.ver4.results
Object.keys(users).forEach(uid => {
  let newu = newjs.ver5.results[uid] = {}
  let results = users[uid]
  Object.keys(results).forEach(rid => {
    let newr = newu[rid] = {}
    let anss = newr['answers'] = {}
    let result = results[rid]
    newr['exam'] = result.exam
    newr['when'] = result.when
    newr['revwhen'] = result.revwhen
    let dt = new Date(result.when).toISOString()
    let dtstr = dt.slice(0, 10) + ' ' + dt.slice(11, 16);
    if (result.answers && result.answers.length) {
      let qs = Object.keys(exams[result.exam].questions).sort()
      console.log(uid, rid, result.exam, dtstr, result.answers.length, '-', qs.length)
      result.answers.forEach((ans, i) => {
        anss[qs[i]] = ans
      });
    } else console.log(uid, rid, result.exam, dtstr, '---- null ----')
  })
})

fs.writeFileSync('output.json', newjs, { spaces: 2 })
