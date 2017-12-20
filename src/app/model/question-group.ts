import { Lib } from './lib';

export class QuestionGroup {

  public static path(groups: QuestionGroup[]): string {
    return groups.map(g => g.id).join('.')
  }

  constructor(
    public readonly id: string,
    public readonly path: string,
    public title: string,
    public readonly eid,
    public notes = '',
    public explanation = '',
  ) { }

  public fullid(): string {
    let out = this.eid + '.'
    if (this.path && this.path !== '') out += this.path + '.'
    // return this.eid + '.' + this.path + '.' + this.id
    return out + this.id
  }

}
