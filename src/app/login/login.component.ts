import { Component } from '@angular/core';
import { DataService } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
