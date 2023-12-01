import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  userDetails: any;

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

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
    });

  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  async getUserInfo() {
    try {
      const userInfo = await this.authService.getUserInfo();
      console.log('User Info:', userInfo);
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }
}
