import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppRoutingModule } from './app-routing.module';
import { firebaseConfig } from './firebase-config';

import { Ng2PaginationModule } from 'ng2-pagination';

import { AuthGuard } from './auth.guard';
import { DataService, DataSource, SecuritySource } from './model/data.service';

import { MockDataSource } from './model/mock-data-source.service';
import { MockSecuritySource } from './model/mock-security-source.service';

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

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2PaginationModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
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
  ],
  providers: [
//    { provide: DataSource, useClass: FirebaseDataSource },
//    { provide: SecuritySource, useClass: FirebaseSecuritySource },
    { provide: DataSource, useClass: MockDataSource },
    { provide: SecuritySource, useClass: MockSecuritySource },
    { provide: DataService, useClass: DataService },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
