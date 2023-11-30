import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  username: string = 'admin';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
  } 

  async logout(): Promise<void> {
    const logoutSuccess = await this.authService.logout();
    if (logoutSuccess) {
      this.gotoPage('login');
    } else {
      console.error('Logout failed');
    }
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
