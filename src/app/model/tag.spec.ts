import { Tag } from "./tag"

describe('Tag', () => {
  it('pathParts', () => {
    expect(Tag.pathParts("Bingo/ Ting /Congo")).toEqual(["Bingo", "Ting", "Congo"])
    expect(Tag.pathParts("Beep ")).toEqual(["Beep"])
  })
  it('pathPaths', () => {
    expect(Tag.pathPaths("A/ B /C")).toEqual(["A", "A / B", "A / B / C"])
    expect(Tag.pathPaths("A ")).toEqual(["A"])
  })
})

//To run this test file alone
//npm run test -- --main src/app/model/tag.spec.ts
