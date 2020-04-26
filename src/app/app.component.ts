import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- <router-outlet></router-outlet> -->
    <div style="margin: 20px;">
      <app-timer style="margin: 20px;"
        [showQSec]="true" [qSec]="65"
        [showTSecToggle]="true" [tSec]="23*60 + 5" [mSec]="1*60*60 + 30*60">
      </app-timer>
      <app-timer style="margin: 20px;"
        [showQSec]="false" [qSec]="65"
        [showTSecToggle]="true" [tSec]="23*60 + 5" [mSec]="1*60*60 + 30*60">
      </app-timer>
      <app-timer style="margin: 20px;"
        [showQSec]="true" [qSec]="65"
        [showTSecToggle]="false" [tSec]="23*60 + 5" [mSec]="1*60*60 + 30*60">
      </app-timer>
      <app-timer style="margin: 20px;"
        [showQSec]="false" [qSec]="65"
        [showTSecToggle]="false" [tSec]="23*60 + 5" [mSec]="1*60*60 + 30*60">
      </app-timer>
    </div>
  `,
  styles: []
})
export class AppComponent {
}
