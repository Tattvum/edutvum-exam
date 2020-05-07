import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-root',
  template: `
    <!-- <router-outlet></router-outlet> -->

    <!-- <div style="margin: 20px;">
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
    </div> -->

    <!-- <div style="margin: 20px;">
      <button mat-button (click)="addBar()">Add</button>
      <app-chart [width]="800" [height]="400" [bars]="bars"></app-chart>
      {{bars.length}}
    </div> -->

    <!-- <div style="margin: 20px;">
      <app-auto-chip placeholder="Hola!" [old]="old" [all]="all"
        (removed)="removeSelection($event)" (added)="addSelection($event)" >
      </app-auto-chip>
    </div> -->

    <div style="margin: 20px;">
      <app-auto-input placeholder="Hola!" [list]="list"
        (added)="addedAutoInput($event)" >
      </app-auto-input> {{selectedFromList}}
    </div>
`,
  styles: []
})
export class AppComponent {

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

  //----

  // bars = [
  //   { value: 10, color: "0,128,0", flags: () => ["a"], action: () => console.log(0) },
  // ]

  // addBar() {
  //   let rndval = Math.random() * 10
  //   this.bars.push({ value: rndval, color: "0,128,20", flags: () => ["b"], action: () => console.log(1) })
  // }

  //----

  // old = [
  //   { id: "one", title: "One is the name of neo" },
  //   { id: "two", title: "Two are the eyes" },
  // ]

  // all = [
  //   { id: "one", title: "One is the name of neo" },
  //   { id: "two", title: "Two are the eyes" },
  //   { id: "three", title: "Three are the gunas" },
  //   { id: "four", title: "Four are the directions" },
  //   { id: "five", title: "Five are the old elements" },
  // ]

  // addSelection(id: string) {
  //   console.log("add1", id)
  //   const obj = this.all.find(o => o.id === id)
  //   console.log("add2", obj)
  //   this.old.push(obj)
  // }

  // removeSelection(id: string) {
  //   console.log("remove", id)
  //   const i = this.old.findIndex(o => o.id === id)
  //   if (i >= 0) this.old.splice(i, 1)
  // }

}
