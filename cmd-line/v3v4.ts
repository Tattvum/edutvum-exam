import fs = require('jsonfile');
let fulljs: any = fs.readFileSync('input.json', 'utf8')

let exams = fulljs.ver3.exams
let questions = fulljs.ver3.questions
let results = fulljs.ver3.results

console.log(">>>>>>")

Object.keys(exams).forEach((id, i) => {
  console.log(i + 1, exams[id].when, id, exams[id].name)
})

console.log("------")

let newjs = fulljs['ver4'] = { exams: {}, results: results }

Object.keys(exams).forEach(eid => {
  let olde = exams[eid]
  let newe = newjs.exams[eid] = {}
  newe['name'] = olde.name
  newe['by'] = olde.by
  newe['when'] = olde.when
  newe['revwhen'] = olde.revwhen
  let qs = newe['questions'] = {}
  olde.questions.forEach(qid => qs[qid] = questions[qid])
})

fs.writeFileSync('output.json', fulljs, { spaces: 2 })

