import { Lib } from './lib'

export interface Thing {
  id: string
  title: string
  when: Date
}

export abstract class AbstractThing implements Thing {
  constructor(
    private _id: string,
    public readonly title: string,
    public readonly when: Date = new Date()
  ) {
    Lib.failif(Lib.isNil(_id), 'id cannot be undefined')
    Lib.failif(Lib.isNil(title), 'title cannot be undefined')
  }

  public get id(): string {
    return this._id;
  }
}
