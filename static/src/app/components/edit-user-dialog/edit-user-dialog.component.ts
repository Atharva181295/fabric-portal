import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../pages/users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  editForm!: FormGroup;
  public onUpdateUser: EventEmitter<any> = new EventEmitter();
  selectedFile: File | null = null; // Variable to store the selected file

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const userData = this.data.user.data.user;
  
    this.editForm = this.fb.group({
      username: [userData.username],
      email: [userData.email, [Validators.email]],
      name: [userData.name],
      profile_image: [''],
    });
  
    // Patch form values and mark controls as touched
    this.editForm.patchValue({
      username: userData.username,
      email: userData.email,
      name: userData.name,
      profile_image: userData.profile_image || '',
    });
  
    // Mark all controls as touched
    Object.keys(this.editForm.controls).forEach(key => {
      this.editForm.get(key)?.markAsTouched();
    });
  }  

  onSaveClick(): void {
    if (this.editForm.valid) {
      const formData = new FormData();
      const userData = this.editForm.value;
      const userId = this.data.userId;
  
      // Append form data excluding profile_image
      Object.keys(userData).forEach(key => {
        if (key !== 'profile_image') {
          formData.append(key, userData[key]);
        }
      });
  
      // Append profile image if it's not null
      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile, this.selectedFile.name);
      }
  
      // Log form data for debugging
      console.log('Form Data:', formData);
  
      this.userService.updateUser(userId, formData).subscribe(
        (response) => {
          console.log('User updated successfully', response);
  
          // Notify the service to reload user data in UserAccountComponent
          this.authService.setReloadUserData(true);
  
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
  

  onFileSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log('Selected File:', this.selectedFile);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
