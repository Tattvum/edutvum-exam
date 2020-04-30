import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lib } from '../model/lib';

@Component({
  selector: 'app-tree-table',
  template: `
    <div style="margin: 20px;">
      <mat-slider [max]="maxLevels" [min]="1" [step]="1" [thumbLabel]="true"
        style="margin-left: 10px;"
        [(ngModel)]="internalLevel">
      </mat-slider> <sp></sp><sp></sp> <b>{{filteredRows.length}}</b> rows

      <table id="report" class="table table-bordered" style="width: 90%;">
        <tr class="maroon shade">
          <!-- <th width="50px"></th> -->
          <th width="10%" class="left">Type</th>
          <th width="3%" class=""></th>
          <th width="40%" class="left">Name</th>
          <th class="right" *ngFor="let name of data.names; let i = index;"
              style="{{data.styles[i]}}">
            {{ name }}
          </th>
        </tr>
        <tr *ngFor="let row of filteredRows" class="highlight" (click)="highlighted(row)">
          <!-- <td>
            <span class="glyphicon glyphicon-plus glyph-ext"></span>
            {{ row.levels}}
          </td> -->
          <td class="left" [class.selected]="row.selected">{{ row.type }}</td>
          <td>
            <span class="glyphicon"
              [class.selected]="row.selected"
              [class.glyphicon-bookmark]="row.selected"></span>
          </td>
          <td class="left bold" [class.selected]="row.selected">{{ row.name }}</td>
          <td class="right" *ngFor="let rv of row.values; let i = index;"
              style="{{data.styles[i]}}">
            {{ show(row.values, i) | number:'1.0-0' }}{{data.suffixes[i]}}
          </td>
        </tr>
        <tr class="shade maroon">
          <td colspan="2"></td>
          <td class="left">Total</td>
          <td class="right" *ngFor="let t of data.totals; let i = index;"
              style="{{data.styles[i]}}">
            {{ show(data.totals, i) | number:'1.0-0' }}{{data.suffixes[i]}}
          </td>
        </tr>
      </table>
    </div>
  `,
  //https://stackoverflow.com/questions/42686104/reduce-the-weight-of-a-glyphicon
  styles: [
    '.right { text-align: right; }',
    '.left { text-align: left; }',
    '.maroon { color: maroon; }',
    '.bold { font-weight: bold; }',
    '.shade { background-color: #dddddd; }',
    '.gray { color: grey; }',
    '.blue { color: #000099; }',
    '.red { color: red; }',
    '.green { color: #009900; }',
    'th, td { text-align: center;}',
    '.table-bordered { table-layout: fixed; }',
    '.table-bordered th, .table-bordered td { border: 1px solid #ddd; padding: 8px;}',
    '.glyph-ext {-webkit-text-stroke: 2px white; color: blue; cursor: pointer;}',
    '.highlight:hover {background-color: #ffd; cursor: pointer;}',
    '.selected {color: red;}',
  ]
})
export class TreeTableComponent implements OnInit {

  @Input() data = {
    names: ["Marks", "Total", "%"],
    styles: ["color: red;", "color: blue;", "color: green;"],
    suffixes: ["", "", "%"],
    totals: [4, 16, "percent"],
    leaves: [
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
    functions: {
      "percent": (arr: any[]) => (arr[0] / arr[1]) * 100
    }
  }

  private _selection: string
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set selection(value: string) {
    console.log("@Input selection:", value)
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
    this.data.leaves.forEach(r => {
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
    console.log("onInit")
    this.selection = this._selection
    if (Lib.isNil(this.level)) this.level = 1
  }

  public get rows(): any[] {
    return Object.keys(this.cache).sort().map(k => this.cache[k])
  }

  public get filteredRows(): any[] {
    return this.rows.filter(r => r.levels <= this.level)
  }

  show(arr: any[], i: number): number {
    if (typeof (this.data.totals[i]) === "number") return arr[i]
    else return this.data.functions[arr[i]](arr)
  }

  highlighted(row: any) {
    this.selectionChange.emit(row.type + " : " + row.name);
  }

}
