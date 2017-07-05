import { Injectable } from '@angular/core';
import { AnswerType } from './answer-type';
import { Question } from './question';

//NOTE: Not used anywhere but in tests, just for sample testing
export function isin<T>(arr: Array<T>, val: T): boolean {
  return arr.indexOf(val) > -1
}

@Injectable()
export abstract class DataService2 {

  //NOTE: Not used anywhere but in tests, just for sample testing
  public testMe(n: number): number {
    return n * 2
  }

}
