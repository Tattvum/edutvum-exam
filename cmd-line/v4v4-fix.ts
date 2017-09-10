console.log(">>>>>>")
import fs = require('jsonfile');
let oldjs: any = fs.readFileSync('input.json', 'utf8')

let newjs = {
  'ver4': {
    'exams': {},
    'results': oldjs.ver4.results
  }
}

let n2s = (n: number) => {
  return ("0" + n).slice(-2);
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

Object.keys(oldjs.ver4.exams).forEach(eid => {
  let eold = oldjs.ver4.exams[eid]
  let enew = newjs.ver4.exams[eid] = {}
  enew['name'] = eold.name
  enew['by'] = eold.by
  enew['when'] = eold.when
  let a = eold.revwhen
  let b = enew['revwhen'] = d2rev(eold.when)
  //console.log(eid, a, b, a === b)
  let qsnew = enew['questions'] = {}
  let qsold = eold.questions
  Object.keys(qsold).forEach(qidold => {
    let regex = new RegExp('(.+)q([0-9]+)(.*)')
    let ok = regex.exec(qidold)
    //console.log(ok)
    if (ok) {
      let qidnew = ok[1] + 'q' + n2s(+ok[2]) + ok[3]
      //console.log(eid, qidold, qidnew)
      qsnew[qidnew] = qsold[qidold]
    } else {
      console.log('ok failed', eid, qidold)
    }
  })
})

fs.writeFileSync('output.json', newjs, { spaces: 2 })
let out: any = fs.readFileSync('output.json', 'utf8')
let examsv4 = out.ver4.exams
