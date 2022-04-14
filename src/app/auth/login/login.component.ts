import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../authservice.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public authService: AuthserviceService) { }

  isLoading = false; 
  private authStatusSub: Subscription

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatus().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }
  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true
    this.authService.logIn(form.value.email, form.value.password)

  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
