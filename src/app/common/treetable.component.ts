import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-table',
  template: `
    <div style="margin: 20px;">
      <mat-slider [max]="maxLevels" [min]="1" [step]="1" [thumbLabel]="true"
        style="margin-left: 10px;"
        [(ngModel)]="level">
      </mat-slider> <sp></sp><sp></sp> <b>{{filteredRows.length}}</b> rows

      <table id="report" class="table table-bordered" style="width: 1080px;">
        <tr class="maroon shade">
          <!-- <th width="50px"></th> -->
          <th width="10%" class="left">Type</th>
          <th width="40%" class="left">Name</th>
          <th class="right" *ngFor="let name of data.names; let i = index;"
              style="{{data.styles[i]}}">
            {{ name }}
          </th>
        </tr>
        <tr *ngFor="let row of filteredRows">
          <!-- <td>
            <span class="glyphicon glyphicon-plus glyph-ext"></span>
            {{ row.levels}}
          </td> -->
          <td class="left">{{ row.type }}</td>
          <td class="left bold">{{ row.name }}</td>
          <td class="right" *ngFor="let rv of row.values; let i = index;"
              style="{{data.styles[i]}}">
            {{ show(row.values, i) | number:'1.0-0' }}{{data.suffixes[i]}}
          </td>
        </tr>
        <tr class="shade maroon">
          <td></td>
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
      "percent": (arr) => (arr[0] / arr[1]) * 100
    }
  }

  cache = {}
  level = 1
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
        let key = r.type + " : " + p[1]
        if (!(key in this.cache)) this.cache[key] =
          { levels: p[0], ...r, name: p[1], values: [...zeros] }
        let rv = this.cache[key].values
        this.data.totals.forEach((t, i) => {
          if (typeof (t) === "number") rv[i] += r.values[i]
        })
      })
    })
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

}
