import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './model/data.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private service: DataService) { }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.service.isLoggedIn();
  }
}
