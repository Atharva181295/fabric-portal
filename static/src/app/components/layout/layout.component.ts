import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  username: string= ''
  userInfo: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserInfo();
  } 

  async logout(): Promise<void> {
    const logoutSuccess = await this.authService.logout();
    if (logoutSuccess) {
      this.gotoPage('login');
    } else {
      console.error('Logout failed');
    }
  }

  async getUserInfo() {
    try {
      const userInfo = await this.authService.getUserInfo();
      this.userInfo =userInfo.username;
      console.log('User Info:', userInfo.username);
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
