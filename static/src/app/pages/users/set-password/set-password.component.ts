import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,  private router: Router,private snackBar: MatSnackBar) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']); 
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }

  async logout(): Promise<void> {
    const logoutSuccess = await this.authService.logout();
    if (logoutSuccess) {
      this.gotoPage('login');
    } else {
      console.error('Logout failed');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;

      const success = await this.authService.changePassword(oldPassword, newPassword);

      if (success) {
        const logoutSuccess = await this.authService.logout();

        if (logoutSuccess) {
          this.snackBar.open('Password changed successfully, Login again with new password', 'Close', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          
          this.gotoPage('login');
          console.log('Password changed successfully');
        } else {
          console.error('Logout failed');
        }
      } else {
        console.error('Failed to change password');
      }
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
  
}
