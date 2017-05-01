import { Component, OnInit } from '@angular/core';
import { DataService, UserInfo } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user = '='

  constructor(
    private service: DataService,
    private router: Router) { }

  ngOnInit() {
    this.service.auth().then(ui => {
      this.user =  ui.name? ui.name: '---'
    })
  }

  logout() {
    this.service.logout().then(()=> {
      this.user = "---"
      this.router.navigateByUrl('')
    })
  }
}
