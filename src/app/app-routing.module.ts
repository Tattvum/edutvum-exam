import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard'
import { LoginComponent } from './login/login.component'
import { StudentDashComponent } from './student-dash/student-dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './result/result.component';
import { TreeTableComponent } from './common/treetable.component';
import { TimerComponent } from './common/timer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const appRoutes: Routes = [
  // { path: '**', component: TimerComponent },
  {
    path: 'student-dash', component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: 'exam-list', component: StudentDashComponent },
  { path: 'question/:rid/:qid/:sid', component: ExamComponent },
  { path: 'question/:rid/:qid', component: ExamComponent },
  { path: 'results/:rid/:sid', component: ExamComponent },
  { path: 'results/:rid', component: ExamComponent },
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
