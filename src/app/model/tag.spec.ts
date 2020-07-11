import { Tag } from "./tag"

describe('Tag', () => {
  it('parse', () => {
    expect(Tag.parse("Bingo/ Ting /Congo")).toEqual(["Bingo", "Ting", "Congo"])
    expect(Tag.parse("Beep ")).toEqual(["Beep"])
  })
  it('pathPaths', () => {
    expect(Tag.paths("A/ B /C")).toEqual(["A", "A / B", "A / B / C"])
    expect(Tag.paths("A ")).toEqual(["A"])
  })
})

//To run this test file alone
//npm run test -- --main src/app/model/tag.spec.ts
