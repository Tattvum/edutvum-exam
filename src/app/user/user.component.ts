import { Component } from '@angular/core';
import { DataService } from '../model/data.service';
import { User } from '../model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(
    public service: DataService,
    private router: Router) { }

  logout() {
    this.service.logout().then(() => {
      this.router.navigate([''])
    })
  }
}
