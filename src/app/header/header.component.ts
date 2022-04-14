import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../auth/authservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthserviceService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuthCheck()
    this.authListenerSubs = this.authService.getAuthStatus().subscribe((result)=> {
          this.userIsAuthenticated = result
    });

  }
  ngOnDestroy() {
   this.authListenerSubs.unsubscribe();
  }
  onLogout() {
    console.log('hello this works');
    
    this.authService.logOut()
  }

}
