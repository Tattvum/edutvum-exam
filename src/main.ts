import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';

import { AppComponent } from './app/app.component';
import { QuillModule } from 'ngx-quill';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AuthGuard } from './app/auth.guard';
import { FirebaseUpload } from './app/model/firebase-upload.service';
import { DataSource, SecurityAPI, UploaderAPI, DataService } from './app/model/data.service';
import { FirebaseAPI } from './app/model/firebase-api.service';
import { LocalFirebaseAPI, EMULATOR_CONFIG } from './app/model/local-firebase-api.service';
import { MockDataSource } from './app/model/mock-data-source.service';
import { FirebaseSecuritySource } from './app/model/firebase-security-source.service';
import { MockSecuritySource } from './app/model/mock-security-source.service';
import { AbstractFirebaseAPI, FirebaseDataSource } from './app/model/firebase-data-source.service';
import { GeneralContext, GeneralContextImpl } from './app/model/general-context';

const DATA_API_SOURCE = environment.mock ? LocalFirebaseAPI : FirebaseAPI
const firebaseConfig = environment.firebaseConfig
const emulatorConfig = environment.emulatorConfig;
const DATA_SOURCE = !environment.firebase ? MockDataSource : FirebaseDataSource
const SECURITY_SOURCE = !environment.firebase ? MockSecuritySource :
  environment.mock ? MockSecuritySource : FirebaseSecuritySource
const UPLOADER_API = FirebaseUpload



if (environment.production) {
  enableProdMode();
}

// https://angularfirebase.com/lessons/hnpwa-angular-5-progressive-web-app-service-worker-tutorial/
// The ServiceWorkerModule needs to register the worker in the app.module.
// ...
// Alternatively, you may need to register the worker manually in the main.ts file.
// I found that this was necessary when integrating the worker with AngularFire2.
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), FormsModule,
      //cant-bind-to-formcontrol-since-it-isnt-a-known-property-of-input-angular
      //https://stackoverflow.com/a/43220824
      //While using formControl, you have to import ReactiveFormsModule to your imports array.
      AngularFireModule.initializeApp(firebaseConfig), AngularFireDatabaseModule, AngularFireAuthModule,
      ReactiveFormsModule, AppRoutingModule, NgxPaginationModule, FlexLayoutModule,
      MatButtonModule, MatButtonToggleModule, MatInputModule, MatSelectModule, MatRadioModule,
      MatProgressBarModule, MatProgressSpinnerModule, MatTableModule, MatPaginatorModule,
      MatListModule, MatCardModule, MatChipsModule, MatTabsModule, MatCheckboxModule, MatIconModule,
      MatAutocompleteModule, MatBadgeModule, MatSliderModule, MatDialogModule, MatSnackBarModule,
      MatToolbarModule, MatTooltipModule, MatSlideToggleModule, MatFormFieldModule,

      //https://github.com/KillerCodeMonkey/ngx-quill
      QuillModule.forRoot()),
    { provide: GeneralContext, useClass: GeneralContextImpl },
    { provide: AbstractFirebaseAPI, useClass: DATA_API_SOURCE },
    { provide: EMULATOR_CONFIG, useValue: emulatorConfig },
    { provide: DataSource, useClass: DATA_SOURCE },
    { provide: SecurityAPI, useClass: SECURITY_SOURCE },
    { provide: UploaderAPI, useClass: UPLOADER_API },
    DataService,
    AuthGuard,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .then(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ngsw-worker.js');
    }
  })
  .catch(err => console.log(err));
