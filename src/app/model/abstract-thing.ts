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
    if (Lib.isNil(_id)) throw Error('id cannot be undefined')
    if (Lib.isNil(title)) throw Error('title cannot be undefined')
  }

  public get id(): string {
    return this._id;
  }
}
