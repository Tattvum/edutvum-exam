import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

// https://angularfirebase.com/lessons/hnpwa-angular-5-progressive-web-app-service-worker-tutorial/
// The ServiceWorkerModule needs to register the worker in the app.module.
// ...
// Alternatively, you may need to register the worker manually in the main.ts file.
// I found that this was necessary when integrating the worker with AngularFire2.

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ngsw-worker.js');
    }
  })
  .catch((err) => console.error(err));
