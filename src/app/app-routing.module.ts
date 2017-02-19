import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExamComponent } from './exam/exam.component';
import { ExamQaComponent } from './exam-qa/exam-qa.component';

const appRoutes: Routes = [
  { path: 'student-dash', component: StudentDashComponent },
  { path: 'admin-dash', component: PageNotFoundComponent },
  { path: 'exam/:eid/:qid', component: ExamComponent },
  { path: 'exam-result/:id', component: ExamQaComponent },
  { path: '', redirectTo: '/student-dash', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
