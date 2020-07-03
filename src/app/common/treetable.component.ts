import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lib } from '../model/lib';

@Component({
  selector: 'app-tree-table',
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss']
})
export class TreeTableComponent implements OnInit {

  @Input() data = {
    cols: [
      { name: "Marks", style: "color: red;", note: "This is a note!" },
      { name: "Total", style: "color: blue;", },
      { name: "%", style: "color: green;", format: (arr: any[]) => Math.round((arr[0] / arr[1]) * 100) },
    ],
    totals: [4, 16, null],
    rows: [
      { type: "Topic", name: "Chemistry / Organic / Amines", values: [1, 10, "percent"] },
      { type: "Topic", name: "Mathematics / Calculus / Integration", values: [4, 10, "percent"] },
      { type: "Topic", name: "Mathematics / Calculus / Differentiation", values: [5, 10, "percent"] },
      { type: "Topic", name: "Chemistry / Organic / Alkanes", values: [1, 10, "percent"] },
      { type: "Difficulty", name: "Easy", values: [1, 10, "percent"] },
      { type: "Topic", name: "Chemistry / InOrganic / s-Block Elements", values: [1, 10, "percent"] },
      { type: "Topic", name: "Mathematics / Vectors", values: [2, 10, "percent"] },
      { type: "Difficulty", name: "Hard", values: [1, 10, "percent"] },
      { type: "Difficulty", name: "Medium", values: [1, 10, "percent"] },
    ],
  }

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
    //console.log(this.data)
    const zeros = [...this.data.totals].map(v => typeof (v) === "number" ? 0 : v)
    this.data.rows.forEach(r => {
      let parts = r.name.split("/").map(p => p.trim())
      let len = parts.length
      if (len > this.maxLevels) this.maxLevels = len
      let paths = parts.map((_, i, arr) => [i + 1, arr.slice(0, i + 1).join(" / ")])
      paths.forEach(p => {
        let key: string = r.type + " : " + p[1]
        if (!(key in this.cache)) this.cache[key] = {
          key: key,
          levels: p[0],
          ...r,
          name: p[1],
          values: [...zeros],
        }
        let rv = this.cache[key].values
        this.data.totals.forEach((t, i) => {
          if (typeof (t) === "number") rv[i] += r.values[i]
        })
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
    const value = row.type + " : " + row.name
    if (this._selection === value) {
      this.clearSelections()
    } else {
      this.selectionChange.emit(value);
    }
  }

  clearSelections() {
    this.selectionChange.emit("::");
  }

  hasSelections(): boolean {
    return this.selection && this.selection.trim() !== "::"
  }

}
