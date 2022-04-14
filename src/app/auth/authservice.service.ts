import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private isAuthenticated = false;
  token: any;
  private tokenTimer:any;
  private userId: any;
  private authStatusLis = new Subject<boolean>();
   ROOT_URL = environment.apiUrl + "/user"

  constructor(private http: HttpClient, private router: Router) { }
  
  createUser(email:string, password:string) {
    const authData: AuthData = { email:email, password: password }
    return this.http.post(this.ROOT_URL + "/signup/", authData)
    .subscribe(() => {
      this.router.navigate(["/"]);
    }, error => {
      this.authStatusLis.next(false)
    });
    //   console.log(response);
    //   this.isAuthenticated = true;
    //   this.authStatusLis.next(true);
    //   this.router.navigate(["/"])
      
    // },error =>{
    //   console.log(error)
    // })
  }

  logIn(email:string, password:string) {
    const authData: AuthData = {email:email, password:password }
    this.http.post<{token: any, expiresIn: number, userId:string}>(this.ROOT_URL + "/login/", authData)
    .subscribe((response) => {
      let tokenFromHttp = response.token;
      this.token = tokenFromHttp;
      //console.log(this.token);

      if(tokenFromHttp) {
      const expiresInDuration = response.expiresIn
      //console.log(expiresInDuration);
      this.setAuthTimer(expiresInDuration)
      
      this.isAuthenticated = true;
      this.authStatusLis.next(true);
      const now = new Date();
      const expirationDate =  new Date (now.getTime() + expiresInDuration * 1000);
      this.userId = response.userId
      console.log(expirationDate);
      
      this.saveToken(this.token, expirationDate, this.userId)
    }
     this.router.navigate(["/"])
     return this.token
      
      
    }, error => {
      this.authStatusLis.next(false)
    }) 
  
  } 

  logOut() { 
    this.clearToken()
  }

  getToken() {
    return this.token
  }

   getAuthStatus() {
     return this.authStatusLis.asObservable();
   }

   getAuthCheck() {
     return this.isAuthenticated
   }
   getUserId() {
     return this.userId
   }

   private saveToken(token:string, expirationDate: Date, userId:any) {
     localStorage.setItem('userId', userId)
     localStorage.setItem('token', token);
     localStorage.setItem('expirationDate', expirationDate.toISOString())
   }

   private setAuthTimer(duration:number) {
     console.log(duration);
     this.tokenTimer = setTimeout(() => {
       this.logOut();
       }, duration * 1000);
   }

    private clearToken() {
     this.token = null;
     this.isAuthenticated = false;
     this.authStatusLis.next(false)
     clearTimeout(this.tokenTimer);
     this.userId = null;
     localStorage.removeItem("userId")
     localStorage.removeItem('token');
     localStorage.removeItem('expirationDate');
     this.router.navigate(["/"])
   }

    getData() {
     const token = localStorage.getItem("token");
     const expirationDate = localStorage.getItem("expirationDate");
     const userId = localStorage.getItem("userId")
        if(!token || !expirationDate) {
             return {}
          }

      else return {
       token:token,
       expirationDate: new Date(expirationDate),
       userId: userId
     }
   }

   autoUserAuth() {
     const authInfo = this.getData();
      if(!authInfo) {
           return
      }
     const now = new Date();
     const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

     if(expiresIn > 0) {
       this.token = authInfo;
       this.userId = authInfo.userId
       this.isAuthenticated = true;
       this.setAuthTimer(expiresIn / 1000)
       this.authStatusLis.next(true);
     }
   }
 
}
