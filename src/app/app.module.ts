import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { Ng2PaginationModule } from 'ng2-pagination';

import { AppComponent } from './app.component';
import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StudentService } from './student.service';
import { ExamResultComponent } from './exam-result/exam-result.component';
import { ExamComponent } from './exam/exam.component';
import { ExamDashComponent } from './exam-dash/exam-dash.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2PaginationModule,
  ],
  declarations: [
    AppComponent,
    StudentDashComponent,
    PageNotFoundComponent,
    ExamResultComponent,
    ExamComponent,
    ExamDashComponent,
  ],
  providers: [
    StudentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
