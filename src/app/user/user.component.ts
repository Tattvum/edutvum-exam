import { Component, OnInit } from '@angular/core';
import { DataService, UserInfo } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(
    private service: DataService,
    private router: Router) { }

  ngOnInit() {
    this.service.ensureAuth()
  }

  logout() {
    this.service.logout().then(()=> {
      console.log('Logging out!');
    })
  }
}
