import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lib } from '../model/lib';

export interface TTCol {
  name: string
  style?: string
  note?: string
  format?: (arr: number[]) => string
}

export interface TTRow {
  tag: string
  values: number[]
  node?: string
}

export interface TreeTableData {
  cols: TTCol[]
  totals: number[]
  rows: TTRow[]
}

@Component({
  selector: 'app-tree-table',
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss']
})
export class TreeTableComponent implements OnInit {

  @Input() data: TreeTableData

  private _selection: string
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();
  get selection(): string {
    return this._selection
  }
  @Input() set selection(value: string) {
    this._selection = value
    this.rows.forEach(r => r.selected = false)
    this.rows.filter(r => r.key.startsWith(value)).forEach(r => {
      r.selected = true
    })
  }

  @Output() levelChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() level: number = 1

  get internalLevel(): number {
    return this.level
  }
  set internalLevel(value: number) {
    this.level = value
    this.levelChange.emit(value)
  }

  cache = {}
  maxLevels = 1

  ngOnInit() {
    const zeros = [...this.data.totals].map(v => Lib.isNum(v) ? 0 : v)
    this.data.rows.forEach(r => {
      let parts = r.tag.split("/").map(p => p.trim())
      let len = parts.length
      if (len > this.maxLevels) this.maxLevels = len
      let paths = parts.map((_, i, arr) => [i + 1, arr.slice(0, i + 1).join(" / ")])
      paths.forEach(p => {
        let key: string = "" + p[1]
        if (!(key in this.cache)) {
          this.cache[key] = { key: key, levels: p[0], tag: p[1], values: [...zeros], node: "" }
        }
        if (this.cache[key].node !== r.node) {
          Lib.addArrays(this.cache[key].values, r.values)
          this.cache[key].node = r.node
        }
      })
    })
    //console.log("onInit")
    this.selection = this._selection
    if (Lib.isNil(this.level)) this.level = 1
  }

  public get rows(): any[] {
    return Object.keys(this.cache).sort().map(k => this.cache[k])
  }

  public get filteredRows(): any[] {
    return this.rows.filter(r => r.levels <= this.level || r.selected)
  }

  show(arr: any[], i: number): any {
    const format = this.data.cols[i].format
    if (Lib.isNil(format)) return arr[i]
    else return format(arr)
  }

  showNote(i: number): string {
    const note = this.data.cols[i].note
    if (Lib.isNil(note)) return ""
    else return note
  }

  highlighted(row: any) {
    if (this._selection === row.tag) this.clearSelections()
    else this.selectionChange.emit(row.tag);

  }

  clearSelections() {
    this.selectionChange.emit("JUNK : u7JqNwfU3W");
  }

  hasSelections(): boolean {
    return this.selection && this.selection.trim() !== "::"
  }

}
