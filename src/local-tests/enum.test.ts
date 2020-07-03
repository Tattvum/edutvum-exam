
enum MyTypes { Alpha, Bravo, Charlie, Delta }
enum MyTypesNum { Alpha, Bravo = 45, Charlie, Delta }
enum MyTypesStr { Alpha = "One", Bravo = "Two", Charlie = "Three", Delta = "Four" }
enum MyTypesHetro { Alpha, Bravo = 23, Charlie, Delta = "Four" }

// console.log(Object.keys(MyTypes))
// console.log(Object.keys(MyTypes).map(k => MyTypes[k]))
// console.log(Object.values(MyTypes))
// const sz = Object.keys(MyTypes).length / 2
// console.log(sz)
// console.log(sz, Object.keys(MyTypes).slice(sz, 2 * sz))
// console.log(MyTypes.Alpha)
// console.log(typeof MyTypes)

// const func = (o: Object) => {
//   console.log('func', typeof o)
//   const sz = Object.keys(MyTypes).length / 2
//   console.log(sz, Object.keys(MyTypes).slice(sz, 2 * sz))
// }

// func(MyTypes)

// console.log(MyTypes)
// console.log(Object.keys(MyTypes))
// console.log(Object.values(MyTypes))
// console.log(Object.values(MyTypes).filter(k => typeof k !== 'number').length)
// console.log('----')

// console.log(MyTypesStr)
// console.log(Object.keys(MyTypesStr))
// console.log(Object.values(MyTypesStr))
// console.log(Object.values(MyTypesStr).filter(k => typeof k !== 'number').length)
// console.log('----')

// console.log(MyTypesHetro)
// console.log(Object.keys(MyTypesHetro))
// console.log(Object.values(MyTypesHetro))
// console.log(Object.values(MyTypesHetro).filter(k => typeof k !== 'number').length)
// console.log('----')

// console.log(MyTypes[2], MyTypes['Charlie'])
// console.log(MyTypesNum[46], MyTypesNum['Charlie'])
// console.log(MyTypesStr['Charlie'])
// console.log(MyTypesHetro[24], MyTypesHetro['Charlie'])

// const mytypes: MyTypes[] = [0, 2]
// console.log(mytypes)
// const mytypesNum: MyTypesNum[] = [0, 2]
// console.log(mytypesNum)
// const mytypesStr: MyTypesStr[] = Object.values(MyTypesStr)
// const mytypesStr1: MyTypesStr[] = [MyTypesStr['Alpha'], MyTypesStr['Charlie']]
// console.log(mytypesStr)
// const mytypesHetro: MyTypesHetro[] = [0, 27]
// console.log(mytypesHetro)

//ts-node src/local-tests/enum.test.ts
