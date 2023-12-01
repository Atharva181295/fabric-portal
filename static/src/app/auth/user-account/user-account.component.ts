import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatDividerModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  userDetails: any;
  userInfo: any;

  constructor(private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchUserDetails();
    this.getUserInfo();
  }

  fetchUserDetails(): void {
    this.authService.whoami().then(userDetails => {
      this.userDetails = userDetails;
    });
  }

  async getUserInfo() {
    try {
      const userInfo = await this.authService.getUserInfo();
      this.userInfo =userInfo;
      console.log('User Info:', userInfo);
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }
}
