import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../pages/users/users.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
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

      // Assuming you have a user ID in the data object
      const userId = this.data.userId;

      this.userService.updateUser(userId, userData).subscribe(
        (response) => {
          console.log('User updated successfully', response);
          this.dialogRef.close(response); // You can pass data back to the calling component if needed
        },
        (error) => {
          console.error('Error updating user', error);
        }
      );
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
