import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatSpinner,
  MatProgressSpinner,
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppRoutingModule } from './app-routing.module';
//https://medium.com/@tomsu/how-to-build-a-library-for-angular-apps-4f9b38b0ed11
//import { IupacModule } from 'iupac';

import { Ng2PaginationModule } from 'ng2-pagination';

import { AuthGuard } from './auth.guard';
import { DataService, DataSource, SecuritySource } from './model/data.service';
import { GeneralContext, GeneralContextImpl } from './model/general-context';

import { MockDataSource } from './model/mock-data-source.service';
import { MockSecuritySource } from './model/mock-security-source.service';
import { FirebaseUpload } from './model/firebase-upload.service';

import { FirebaseAPI } from './model/firebase-api.service';
import { FirebaseSecuritySource } from './model/firebase-security-source.service';
import { FirebaseDataSource } from './model/firebase-data-source.service';

import { AppComponent } from './app.component';
import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExamComponent } from './exam/exam.component';
import { NavComponent } from './nav/nav.component';
import { DisplayComponent } from './display/display.component';
import { ChoiceInputComponent } from './choice-input/choice-input.component';
import { ResultComponent } from './result/result.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { PopupComponent } from './popup/popup.component';

import { SpaceComponent } from './common/sp.component';
import { NumberInputComponent } from './common/num.component';
import { SmallIntInputComponent } from './common/smallint.component';

import { environment } from '../environments/environment';
import { DetailsComponent } from './details/details.component';
import { ChartComponent } from './chart/chart.component';
import { EditorComponent } from './editor/editor.component';
import { Editor1Component } from './editor1/editor1.component';
import { MathJaxDirective } from './mathjax.directive';

export const firebaseConfig = environment.firebaseConfig;

let DATA_SOURCE = environment.firebase ? FirebaseDataSource : MockDataSource
let SECURITY_SOURCE = environment.firebase ? FirebaseSecuritySource : MockSecuritySource

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    Ng2PaginationModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    MatCheckboxModule
    //    IupacModule,
  ],
  declarations: [
    AppComponent,
    StudentDashComponent,
    PageNotFoundComponent,
    ExamComponent,
    NavComponent,
    DisplayComponent,
    ChoiceInputComponent,
    ResultComponent,
    LoginComponent,
    UserComponent,
    DetailsComponent,
    ChartComponent,
    PopupComponent,
    EditorComponent,
    Editor1Component,
    MathJaxDirective,
    SpaceComponent,
    NumberInputComponent,
    SmallIntInputComponent,
  ],
  providers: [
    { provide: GeneralContext, useClass: GeneralContextImpl },
    { provide: DataSource, useClass: DATA_SOURCE },
    { provide: SecuritySource, useClass: SECURITY_SOURCE },
    FirebaseAPI,
    FirebaseUpload,
    DataService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
