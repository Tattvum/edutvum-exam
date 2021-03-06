import { Component } from '@angular/core';
import { UserDisplayContext, DataService } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  context: UserDisplayContext

  constructor(private router: Router, service: DataService) {
    this.context = service;
  }

  userProfile() {
    this.router.navigate(['/student-dash'])
  }

  logout() {
    this.context.logout().then(() => {
      this.router.navigate([''])
    })
  }

}
