import { Component } from '@angular/core';
import { DataService } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private service: DataService,
    private router: Router) { }

  login() {
    this.service.login().then(auth => {
      this.router.navigate(['/student-dash'])
    })
  }

}
