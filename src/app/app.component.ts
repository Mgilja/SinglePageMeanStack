import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from './auth/authservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthserviceService) {}

  ngOnInit(): void {
    this.authService.autoUserAuth()
  }
}

