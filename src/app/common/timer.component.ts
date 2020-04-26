import { Component, Input, OnInit } from '@angular/core';
import { Lib } from 'app/model/lib';

@Component({
  selector: 'app-timer',
  template: `
    <div>
      <table>
        <tr>
          <td id="qsec" [class.hidden]="!showQSec">
            <span class="qsec">
              {{ timize(qSec) }} - &nbsp;
            </span>
          <td>
          <td>
            <span [class.descending]="isDescending && showTSecToggle"
                (click)="toggleDescending()"
                [class.actionable]="showTSecToggle">
              {{ timize(tSecShow) }}
            </span>
            <td>
          <td>
            <span class="glyphicon actionable" style="color: blue;"
              [class.hidden]="!showTSecToggle"
              [class.glyphicon-arrow-up]="!isDescending"
              [class.glyphicon-arrow-down]="isDescending"
              (click)="toggleDescending()">
            </span>
          <td>
          <td>
            <span *ngIf="showTSecToggle" style="color: blue; padding-top: 4px;">
              <sp></sp><sp></sp>
              <span>Max. Duration: <span>{{ timize(mSec) }}</span></span>
            </span>
          <td>
        </tr>
      </table>
    </div>
  `,
  styles: [
    '.descending { background-color: yellow; }',
    '.actionable { cursor: pointer; }',
    '#qsec { color: salmon; font-size: larger; font-weight: bold; }',
  ]
})
export class TimerComponent implements OnInit {

  @Input() showQSec: boolean = true
  @Input() qSec: number = 1 * 60 + 5
  @Input() showTSecToggle: boolean = true
  @Input() tSec: number = 23 * 60 + 5
  @Input() mSec: number = 1 * 60 * 60 + 30 * 60


  isDescending: boolean = true

  ngOnInit() {
  }

  get tSecShow(): number {
    let secs = this.tSec
    if (this.showTSecToggle && this.isDescending) {
      secs = this.mSec - secs
    }
    return secs
  }

  timize(secs: number) {
    return Lib.timize(secs)
  }

  toggleDescending() {
    if (!this.showTSecToggle) return
    this.isDescending = !this.isDescending
  }

}
