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
  }

  login() {
    this.service.login().then(auth => {
      console.log("LOGGED IN!")
      this.router.navigate(['/student-dash'])
    })
  }

}
