import { Lib } from "./lib"

export interface ParseData {
  type: string
  parts: string[]
}

export class Tag {

  public static parse(title: string): ParseData {
    let out = { type: "", parts: [], paths: [] }
    let parts = title.split(":")
    Lib.failif(parts.length !== 2, "ERROR: Should have exactly 1 colon (:)")
    out.type = parts[0].trim()
    out.parts = parts[1].split("/").map(p => p.trim())
    return out
  }

  private static join(pd: ParseData): string {
    return pd.type + " : " + pd.parts.join(" / ")
  }

  public static clean(title: string): string {
    return Tag.join(Tag.parse(title))
  }

  private _parseData: ParseData

  constructor(readonly id: string, private _title: string) {
    let pd = this._parseData = Tag.parse(_title)
    _title = Tag.join(pd)
  }

  public get parseData(): ParseData {
    return this._parseData
  }

  public get title(): string {
    return this._title
  }

  public get paths(): string[] {
    let out = []
    for (let i = 1; i <= this.parseData.parts.length; i++) {
      out.push(this.parseData.parts.slice(0, i).join(" / "))
    }
    return out
  }

}

export const EMPTY_TAG = new Tag("00", "Dummy: Tag")
