import { Lib } from "./lib"

export class Tag {

  public static parse(path: string): string[] {
    path = path.replace(":", "/")
    return path.split("/").map(p => p.trim())
  }

  private static join(parts: string[]): string {
    return parts.join(" / ")
  }

  public static clean(title: string): string {
    return Tag.join(Tag.parse(title))
  }

  public static partsPaths(parts: string[]) {
    return parts.map((_, i, arr) => arr.slice(0, i + 1).join(" / "))
  }

  public static paths(path: string) {
    return this.partsPaths(Tag.parse(path))
  }

  //----------------------------------------------------------------------------

  constructor(readonly id: string, private _title: string) {
    _title = Tag.clean(_title)
    //this.title = _title // Same, but les intutive?
  }

  //----------------------------------------------------------------------------

  public get title(): string {
    return this._title
  }

  public set title(value: string) {
    this._title = Tag.clean(value)
  }

  public get parse(): string[] {
    return Tag.parse(this._title)
  }

  public get paths(): string[] {
    return Tag.paths(this.title)
  }

}

//------------------------------------------------------------------------------

export const EMPTY_TAG = new Tag("00", "Parent / Child / Grand Child")
