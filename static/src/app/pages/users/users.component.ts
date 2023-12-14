import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { EditUserDialogComponent } from '../../components/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit {
  users: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.updatePaginator();
  }

  private updatePaginator(): void {
    this.userService.getUsers().subscribe((response: any) => {
      this.users = response.users.map((user: any) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      }));

      this.dataSource = new MatTableDataSource<any>(this.users);
      this.dataSource.paginator = this.paginator;
      this.paginator.length = this.users.length;
      this.paginator.pageIndex = 0;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  deleteUser(user: any): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this user?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.userService.deleteUser(user.id).subscribe(
          () => {
            this.updatePaginator();
          },
          error => {
            console.error('Error deleting user', error);
          }
        );
      }
    });
  }
}
