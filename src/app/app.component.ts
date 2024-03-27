import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { TimerComponent } from './common/timer.component';
import { ChartComponent } from './common/chart.component';
import { AutoChipComponent } from './common/autochip.component'
import { AutoInputComponent } from './common/autoinput.component';
import { TreeTableComponent } from './common/treetable.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TimerComponent, ChartComponent, AutoChipComponent, AutoInputComponent,
    TreeTableComponent, RouterOutlet,
  ],
  template: `

@if (env.testComponent==='----') {
  <router-outlet></router-outlet>
}

<!-- --------------------- Component Testing Below ------------------------- -->

@if (env.testComponent==='app-timer') {
  <div style="margin: 20px;">
    <app-timer style="margin: 20px;"
      [showQSec]="true" [qSec]="65"
      [showTSecToggle]="true" [tSec]="23*60 + 5"
      [showMSec]="true" [mSec]="1*60*60 + 30*60">
    </app-timer>
    <app-timer style="margin: 20px;"
      [showQSec]="true" [qSec]="65"
      [showTSecToggle]="true" [tSec]="23*60 + 5"
      [showMSec]="false" [mSec]="1*60*60 + 30*60">
    </app-timer>
    <app-timer style="margin: 20px;"
      [showQSec]="false" [qSec]="65"
      [showTSecToggle]="true" [tSec]="23*60 + 5"
      [showMSec]="true" [mSec]="1*60*60 + 30*60">
    </app-timer>
    <app-timer style="margin: 20px;"
      [showQSec]="false" [qSec]="65"
      [showTSecToggle]="true" [tSec]="23*60 + 5"
      [showMSec]="false" [mSec]="1*60*60 + 30*60">
    </app-timer>
    <app-timer style="margin: 20px;"
      [showQSec]="true" [qSec]="65"
      [showTSecToggle]="false" [tSec]="23*60 + 5"
      [showMSec]="true" [mSec]="1*60*60 + 30*60">
    </app-timer>
    <app-timer style="margin: 20px;"
      [showQSec]="true" [qSec]="65"
      [showTSecToggle]="false" [tSec]="23*60 + 5"
      [showMSec]="false" [mSec]="1*60*60 + 30*60">
    </app-timer>
    <app-timer style="margin: 20px;"
      [showQSec]="false" [qSec]="65"
      [showTSecToggle]="false" [tSec]="23*60 + 5"
      [showMSec]="true" [mSec]="1*60*60 + 30*60">
    </app-timer>
    <app-timer style="margin: 20px;"
      [showQSec]="false" [qSec]="65"
      [showTSecToggle]="false" [tSec]="23*60 + 5"
      [showMSec]="false" [mSec]="1*60*60 + 30*60">
    </app-timer>
  </div>
}

<!-- --------------------- Component Testing Below ------------------------- -->

@if (env.testComponent==='app-chart') {
  <div style="margin: 20px;">
    <!-- oh! after clicking Add, move mouse our the chart component!!!! -->
    <button mat-button (click)="addBar()">Add</button>
    <app-chart [width]="800" [height]="400" [bars]="bars"></app-chart>
    {{bars.length}}
  </div>
}

<!-- --------------------- Component Testing Below ------------------------- -->

@if (env.testComponent==='app-auto-chip') {
  <div style="margin: 20px;">
    <app-auto-chip placeholder="Hola!" [old]="old" [all]="all"
      (removed)="removeSelection($event)" (added)="addSelection($event)" >
    </app-auto-chip>
  </div>
}

<!-- --------------------- Component Testing Below ------------------------- -->

@if (env.testComponent==='app-auto-input') {
  <div style="margin: 20px;">
    <app-auto-input placeholder="Hola!" [list]="list"
      (added)="addedAutoInput($event)" >
    </app-auto-input> {{selectedFromList}}
  </div>
}

<!-- --------------------- Component Testing Below ------------------------- -->

@if (env.testComponent==='app-tree-table') {
  <div>
    <app-tree-table [data]="ttdata" [(level)]="level" [(selection)]="selection" >
    </app-tree-table>
    {{selection}}
  </div>
}

<!-- --------------------- ----------------------- ------------------------- -->

`,
  styles: []
})
export class AppComponent {
  env = environment

  // app-chart -----------------------------------------------------------------

  bars = [
    { value: 10, color: "0,128,0", flags: () => ["a"], action: () => console.log(0) },
  ]

  addBar() {
    let rndval = Math.random() * 10
    this.bars.push({
      value: rndval, color: "0,128,20",
      flags: () => ["b"], action: () => console.log(1)
    })
  }

  // app-auto-chip -------------------------------------------------------------

  old = [
    { id: "one", title: "One is the name of neo" },
    { id: "two", title: "Two are the eyes" },
  ]

  all = [
    { id: "one", title: "One is the name of neo" },
    { id: "two", title: "Two are the eyes" },
    { id: "three", title: "Three are the gunas" },
    { id: "four", title: "Four are the directions" },
    { id: "five", title: "Five are the old elements" },
  ]

  addSelection(id: string) {
    console.log("add1", id)
    const obj = this.all.find(o => o.id === id)
    console.log("add2", obj)
    this.old.push(obj)
  }

  removeSelection(id: string) {
    console.log("remove", id)
    const i = this.old.findIndex(o => o.id === id)
    if (i >= 0) this.old.splice(i, 1)
  }

  // app-auto-input ------------------------------------------------------------

  selectedFromList: string

  list = [
    { id: "one", title: "1 is the name of neo" },
    { id: "two", title: "2 are the eyes" },
    { id: "three", title: "3 are the gunas" },
    { id: "four", title: "4 are the directions" },
    { id: "five", title: "5 are the old elements" },
  ]

  addedAutoInput(id: string) {
    console.log("addedAutoInput", id)
    this.selectedFromList = id
  }

  // app-tree-table ------------------------------------------------------------

  ttdata = {
    cols: [
      { name: "Marks", style: "color: red;", note: "This is a note!" },
      { name: "Total", style: "color: blue;", },
      { name: "%", style: "color: green;", format: (arr: any[]) => Math.round((arr[0] / arr[1]) * 100) },
    ],
    totals: [4, 16, null],
    rows: [
      { tag: "Topic / Chemistry / Organic / Amines", values: [1, 10, null], node: "q1" },
      { tag: "Topic / Mathematics / Calculus / Integration", values: [1, 10, null], node: "q2" },
      { tag: "Topic / Mathematics / Calculus / Differentiation", values: [1, 10, null], node: "q2" },
      { tag: "Topic / Chemistry / Organic / Alkanes", values: [1, 10, null], node: "q3" },
      { tag: "Difficulty / Easy", values: [1, 10, null], node: "q3" },
      { tag: "Topic / Chemistry / InOrganic / s-Block Elements", values: [1, 10, null], node: "q4" },
      { tag: "Difficulty / Medium", values: [1, 10, null], node: "q4" },
      { tag: "Topic / Mathematics / Vectors", values: [1, 10, null], node: "q5" },
      { tag: "Difficulty / Hard", values: [1, 10, null], node: "q5" },
    ],
  }

  selection = "4^324ee"
  level = 3

  // ---------------------------------------------------------------------------

}
