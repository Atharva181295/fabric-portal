import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatDividerModule, MatIconModule, MatButtonModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  userDetails: any;
  userInfo: any;

  constructor(private authService: AuthService, private dialog: MatDialog, private router: Router,) { }

  ngOnInit(): void {
    this.fetchUserDetails();
    this.getUserInfo();
  }

  fetchUserDetails(): void {
    this.authService.whoami().then(userDetails => {
      this.userDetails = userDetails;
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']); 
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
