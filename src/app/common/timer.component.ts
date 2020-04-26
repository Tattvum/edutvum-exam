import { Component, Input, OnInit } from '@angular/core';
import { Lib } from 'app/model/lib';

@Component({
  selector: 'app-timer',
  template: `
    <div fxLayout="row" gdArea="content" style="margin-top: 1px;">
      <span style="margin-top: 2px;" id="qsec" class="qsec" [class.hidden]="!showQSec" >
        {{ timize(qSec) }} <sp></sp>
      </span>
      <span style="margin-top: 4px; padding: 0px 2px 0px 6px;" [class.descending]="showTSecToggleReally && isDescending"
          (click)="toggleDescending()"
          [class.actionable]="showTSecToggleReally">
        {{ timize(tSecShow) }}
      </span>
      <span style="margin-top: 5px;" >
        <span class="glyphicon actionable" style="color: blue;"
          [class.hidden]="!showTSecToggleReally"
          [class.glyphicon-arrow-up]="!isDescending"
          [class.glyphicon-arrow-down]="isDescending"
          (click)="toggleDescending()">
        </span>
      </span>
      <span *ngIf="showMSec" style="color: blue; margin-top: 4px;">
        <sp></sp><sp></sp><sp></sp><sp></sp>
        <span>Max. Duration: <span>{{ timize(mSec) }}</span></span>
      </span>
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
  @Input() showMSec: boolean = true
  @Input() mSec: number = 1 * 60 * 60 + 30 * 60


  isDescending: boolean = true

  ngOnInit() {
  }

  get tSecShow(): number {
    let secs = this.tSec
    if (this.showTSecToggleReally && this.isDescending) {
      secs = this.mSec - secs
    }
    return secs
  }

  timize(secs: number) {
    return Lib.timize(secs)
  }

  get showTSecToggleReally() {
    return this.showMSec && this.showTSecToggle
  }

  toggleDescending() {
    if (!this.showTSecToggleReally) return
    this.isDescending = !this.isDescending
  }

}
