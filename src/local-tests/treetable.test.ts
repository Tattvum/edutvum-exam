//ts-node src/local-tests/treetable.test.ts

import { Lib } from '../app/model/lib'

const rows = [
  { tag: "A+/B1/C1", values: [1, 2, null], node: "q1" },
  { tag: "A+/B1/C2", values: [1, 2, null], node: "q1" },
  { tag: "A+/B1", values: [1, 2, null], node: "q1" },
  { tag: "A+/B1/C1", values: [1, 2, null], node: "q2" },
  { tag: "A+/B2/C3", values: [1, 2, null], node: "q2" },
]

/* WRONG
  A               5   10  null        q1  q2
  A / B1          4   8   null        q1  q2
  A / B1 / C1     2   4   null        q1  q2
  A / B1 / C2     1   2   null        q1
  A / B2          1   2   null        q2
  A / B2 / C3     1   2   null        q2
*/

/* CORRECT
  A               4   8   null        q1  q2
  A / B1          3   6   null        q1  q2
  A / B1 / C1     2   4   null        q1  q2
  A / B1 / C2     1   2   null        q1
  A / B2          1   2   null        q2
  A / B2 / C3     1   2   null        q2
*/

const cache = {}
interface Row { tag: string, values: number[], node: string }
const defrow: Row = { tag: "", values: [0, 0, null], node: "" }
const defrowgen = (t: string): Row => ({ tag: t, ...Lib.clone(defrow), })

rows.forEach(r => {
  const parts = r.tag.split("/").map(p => p.trim())
  const paths = parts.map((_, i, arr) => arr.slice(0, i + 1).join(" / "))
  paths.forEach(p => {
    const nrow = Lib.getKinC<Row>(p, cache, defrowgen)
    if (nrow.node !== r.node) {
      Lib.addArrays(nrow.values, r.values)
      nrow.node = r.node
      console.log(cache)
    }
  })
})


