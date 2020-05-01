import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>

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
      <app-chart [width]="800" [height]="400"></app-chart>
    </div> -->

`,
  styles: []
})
export class AppComponent {
}
