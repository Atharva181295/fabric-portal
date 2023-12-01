import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../pages/users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  editForm!: FormGroup;
  public onUpdateUser: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private snackBar: MatSnackBar, // Inject MatSnackBar
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      username: [this.data.username, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      name: [this.data.name, Validators.required],
      // Add other fields as needed
      
    });
  }

  onSaveClick(): void {
    if (this.editForm.valid) {
      const userData = this.editForm.value;
      const userId = this.data.userId;

      this.userService.updateUser(userId, userData).subscribe(
        (response) => {
          console.log('User updated successfully', response);
          
          this.snackBar.open('User updated successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top', 
          });
          
          
          this.onUpdateUser.emit({ userId, userData });
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error updating user', error);
         
          this.snackBar.open('Error updating user', 'Close', {
            duration: 3000,
            verticalPosition: 'top', 
            panelClass: ['error-snackbar'],
          });
        }
      );
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
