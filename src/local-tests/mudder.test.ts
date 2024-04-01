import { Lib } from '../app/model/lib';
let mudder = require('mudder');

namespace muddertest1 {
  const gap = 10
  const out = []
  const hex = new mudder.SymbolTable('0123456789')
  out.splice(0, 0, ...hex.mudder('', '', gap))
  for (let i = 8; i >= 0; i--) {
    let a = i
    let b = i + 1
    out.splice(b, 0, ...hex.mudder(out[a], out[b], gap))
  }
  console.log(out)
  console.log("duplicates:", (new Set(out)).size !== out.length)
}

namespace muddertest2 {
  const hex = new mudder.SymbolTable('0123456789')
  const out = hex.mudder('', '', 1000)
  console.log(out.slice(900, 1000))
  console.log("duplicates:", (new Set(out)).size !== out.length)
}

namespace muddertest3 {
  const out = ['000']
  const hex = new mudder.SymbolTable('0123456789')
  for (let i = 0; i < 100; i++) {
    out.push(...hex.mudder(out[i], '9', 1))
  }
  console.log(out)
  console.log("duplicates:", (new Set(out)).size !== out.length)
}

namespace muddertest4 {
  let s = '023'
  let n = parseInt(s) + 1
  let ss = '000' + n
  console.log(ss.slice(-3))
}

// bun src/local-tests/treetable.test.ts