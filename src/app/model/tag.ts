export class Tag {
  constructor(
    readonly id: string,
    readonly title: string,
  ) { }
}

export const EMPTY_TAG = new Tag("00", "Dummy Tag")
