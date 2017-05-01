import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard'
import { LoginComponent } from './login/login.component'
import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './result/result.component';

const appRoutes: Routes = [
  {
    path: 'student-dash', component: StudentDashComponent,
    canActivate: [AuthGuard]
  },
  { path: 'question/:eid/:qid', component: ExamComponent },
  { path: 'results/:eid', component: ExamComponent },
  { path: '', component: LoginComponent },
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
