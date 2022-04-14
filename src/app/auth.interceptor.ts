import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthserviceService } from './auth/authservice.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthserviceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken()
    //console.log(authToken)
    const authRequest = request.clone({
     headers:request.headers.set("authorization","token " +  authToken)
    });
    return next.handle(authRequest);
  }
}
