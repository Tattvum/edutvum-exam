import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AppRoutingModule } from './app-routing.module';
import { firebaseConfig } from './firebase-config';

import { Ng2PaginationModule } from 'ng2-pagination';

import { AuthGuard } from './auth.guard';
import { DataService } from './model/data.service';
import { MockDataService } from './model/mock-data.service';
import { FirebaseDataService } from './model/firebase-data.service';

import { AppComponent } from './app.component';
import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExamComponent } from './exam/exam.component';
import { NavComponent } from './nav/nav.component';
import { DisplayComponent } from './display/display.component';
import { ChoiceInputComponent } from './choice-input/choice-input.component';
import { ResultComponent } from './result/result.component';
import { ModalComponent } from './extra/modal/modal.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2PaginationModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
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
    ModalComponent,
    LoginComponent,
    UserComponent,
  ],
  providers: [
    { provide: DataService, useClass: FirebaseDataService },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
