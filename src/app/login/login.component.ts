import { Component, OnInit } from '@angular/core';
import { DataService } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private service: DataService,
    private router: Router) { }

  ngOnInit() {
    this.service.isLoggedIn().then(auth => {
      this.router.navigate(['/student-dash'])
    })
  }

  login() {
    this.service.login().then(auth => {
      this.router.navigate(['/student-dash'])
    })
  }

}
