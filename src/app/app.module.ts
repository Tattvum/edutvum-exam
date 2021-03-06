import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ServiceWorkerModule } from '@angular/service-worker';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppRoutingModule } from './app-routing.module';
//https://medium.com/@tomsu/how-to-build-a-library-for-angular-apps-4f9b38b0ed11
//import { IupacModule } from 'iupac';

import { NgxPaginationModule } from 'ngx-pagination';

import { AuthGuard } from './auth.guard';
import { DataService, DataSource, SecurityAPI, UploaderAPI } from './model/data.service';
import { GeneralContext, GeneralContextImpl } from './model/general-context';

import { MockDataSource } from './model/mock-data-source.service';
import { MockSecuritySource } from './model/mock-security-source.service';
import { FirebaseUpload } from './model/firebase-upload.service';
import { LocalUpload } from './model/local-upload.service';

import { FirebaseAPI } from './model/firebase-api.service';
import { FirebaseSecuritySource } from './model/firebase-security-source.service';
import { FirebaseDataSource, AbstractFirebaseAPI } from './model/firebase-data-source.service';

import { LocalFirebaseAPI, EMULATOR_CONFIG } from './model/local-firebase-api.service';

import { AppComponent } from './app.component';
import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExamComponent } from './exam/exam.component';
import { NavComponent } from './nav/nav.component';
import { DisplayComponent } from './display/display.component';
import { ChoiceInputComponent } from './choice-input/choice-input.component';
import { CommentsManagerComponent } from './comments-manager/comments-manager.component';
import { TagsManagerComponent } from './tags-manager/tags-manager.component';
import { ResultComponent } from './result/result.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { QuestionsManagerComponent } from './questions-manager/questions-manager.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ResultsChartComponent } from './results-chart/results-chart.component';

import { SpaceComponent } from './common/sp.component';
import { NumberInputComponent } from './common/num.component';
import { SmallIntInputComponent } from './common/smallint.component';
import { ListInputComponent } from './common/list.component';
import { TreeTableComponent } from './common/treetable.component';
import { TimerComponent } from './common/timer.component';
import { ChartComponent } from './common/chart.component';
import { AutoInputComponent } from './common/autoinput.component';
import { AutoChipComponent } from './common/autochip.component';

import { environment } from '../environments/environment';
import { DetailsComponent } from './details/details.component';
import { EditorComponent } from './editor/editor.component';
import { MathJaxDirective } from './mathjax.directive';
import { QuillModule } from 'ngx-quill'

const firebaseConfig = environment.firebaseConfig
const emulatorConfig = environment.emulatorConfig;

if (!environment.mock && !environment.firebase)
  throw "ERROR: Both mock and firebase cannot be false togather!";

// let UPLOADER_API = environment.mock ? LocalUpload : FirebaseUpload
const UPLOADER_API = FirebaseUpload
const DATA_API_SOURCE = environment.mock ? LocalFirebaseAPI : FirebaseAPI
const DATA_SOURCE = !environment.firebase ? MockDataSource : FirebaseDataSource
const SECURITY_SOURCE = !environment.firebase ? MockSecuritySource :
  environment.mock ? MockSecuritySource : FirebaseSecuritySource

// console.log(DATA_SOURCE, SECURITY_SOURCE)
if (DATA_SOURCE == null) throw "ERROR: DATA_SOURCE cannot be null!";

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    FormsModule,
    //cant-bind-to-formcontrol-since-it-isnt-a-known-property-of-input-angular
    //https://stackoverflow.com/a/43220824
    //While using formControl, you have to import ReactiveFormsModule to your imports array.
    ReactiveFormsModule,
    AppRoutingModule,
    NgxPaginationModule,
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
    MatCheckboxModule,
    MatIconModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatSliderModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSlideToggleModule,
    HttpClientModule,
    //https://github.com/KillerCodeMonkey/ngx-quill
    QuillModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    StudentDashComponent,
    PageNotFoundComponent,
    ExamComponent,
    NavComponent,
    DisplayComponent,
    ChoiceInputComponent,
    CommentsManagerComponent,
    TagsManagerComponent,
    ResultComponent,
    LoginComponent,
    UserComponent,
    DetailsComponent,
    ChartComponent,
    EditorComponent,
    MathJaxDirective,
    SpaceComponent,
    NumberInputComponent,
    SmallIntInputComponent,
    ListInputComponent,
    QuestionsManagerComponent,
    TreeTableComponent,
    TimerComponent,
    UserProfileComponent,
    AutoInputComponent,
    AutoChipComponent,
    ResultsChartComponent,
  ],
  providers: [
    { provide: GeneralContext, useClass: GeneralContextImpl },
    { provide: AbstractFirebaseAPI, useClass: DATA_API_SOURCE },
    { provide: EMULATOR_CONFIG, useValue: emulatorConfig },
    { provide: DataSource, useClass: DATA_SOURCE },
    { provide: SecurityAPI, useClass: SECURITY_SOURCE },
    { provide: UploaderAPI, useClass: UPLOADER_API },
    DataService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
