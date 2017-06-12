import { Component } from '@angular/core';
import { DataService, User } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  constructor(
    private service: DataService,
    private router: Router) { }

  logout() {
    this.service.logout().then(() => {
      this.router.navigate([''])
    })
  }
}
