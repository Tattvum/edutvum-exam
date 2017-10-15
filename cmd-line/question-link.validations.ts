import { DataLib } from './library'

export class QuestionLinkValidations {
  public static validate(data): boolean {
    DataLib.drill({
      t: [o => o.questions, o => o],
      e: [o => [], o => []],
      last: (...x) => {

      },
    }, data.ver5.exams)
    return false
  }
}
