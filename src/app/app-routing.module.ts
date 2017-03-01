import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './result/result.component';

const appRoutes: Routes = [
  { path: 'student-dash', component: StudentDashComponent },
  { path: 'question/:eid/:qid', component: ExamComponent },
  { path: 'results/:eid', component: ExamComponent },
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
