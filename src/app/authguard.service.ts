import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from 'src/app/auth/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private authService:AuthserviceService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): 
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      const isAuth = this.authService.getAuthCheck()
      if(!isAuth) {
            this.router.navigate(["/login"])
      }
    return isAuth;
  }
}
