import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  DataService, Exam, ExamResult, Question, AnswerType, Lib
} from './data.service'

export class QuestionImpl extends Question {
  private _html: string
  get html(): string {
    return this._html
  }
  set html(val: string) {
    this._html = val
  }
}

@Injectable()
export abstract class AbstractMockDataService extends DataService {

}
