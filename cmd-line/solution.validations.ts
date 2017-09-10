import { DataLib } from './library'

export class SolutionValidations {
  public static validate(data): boolean {
    DataLib.drill({
      t: [o => o.questions, o => o],
      e: [o => [], o => []],
      last: (...x) => null,
    }, data)
    return false
  }
}
