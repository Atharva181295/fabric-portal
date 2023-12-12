import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EditUserDialogComponent } from '../../components/edit-user-dialog/edit-user-dialog.component';
import { UsersService } from '../../pages/users/users.service';
import { MatTableDataSource } from '@angular/material/table';

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
  users: any[] = [];
  dataSource = new MatTableDataSource<any>([]);


  constructor(private authService: AuthService,
     private dialog: MatDialog, private router: Router,
     private userService: UsersService,) { }

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

  editUser(user: any): void {
    this.userService.getUserById(user.id).subscribe(
      (userDetails) => {
        const dialogRef = this.dialog.open(EditUserDialogComponent, {
          width: '350px',
          data: { user: userDetails, userId: user.id }
        });

        dialogRef.componentInstance.onUpdateUser.subscribe((updatedUser: any) => {
          
          const index = this.users.findIndex(u => u.id === updatedUser.userId);
          if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updatedUser.userData };
            this.dataSource.data = this.users;
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed with result:', result);
        });
      },
      (error) => {
        console.error('Error fetching user details', error);
      }
    );
  }
}
