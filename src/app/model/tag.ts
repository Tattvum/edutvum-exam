import { Lib } from "./lib"

export interface ParseData {
  type: string
  parts: string[]
  paths: string[]
}

export class Tag {

  constructor(
    readonly id: string,
    readonly title: string,
  ) { }

  public get parse(): ParseData {
    let out = { type: "", parts: [], paths: [] }
    let parts = this.title.split(":")
    Lib.failif(parts.length !== 2, "ERROR: Should have exactly 1 colon (:)")
    out.type = parts[0]
    out.parts = parts[1].split("/").map(p => p.trim())
    for (let i = 1; i <= out.parts.length; i++) {
      out.paths.push(out.parts.slice(0, i).join(" / "))
    }
    //console.log(out)
    return out
  }

  public static validate(title: string) {
    let parts = title.split(":")
    Lib.failif(parts.length !== 2, "ERROR: Should have exactly 1 colon (:)")
  }
}

export const EMPTY_TAG = new Tag("00", "Dummy Tag")
