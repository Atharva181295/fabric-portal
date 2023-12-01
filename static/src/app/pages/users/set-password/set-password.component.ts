import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,  private router: Router,) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']); 
  }

  async onSubmit(): Promise<void> {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;

      
      const success = await this.authService.changePassword(oldPassword, newPassword);

      if (success) {
        console.log('Password changed successfully');
      } else {
        console.error('Failed to change password');
      }
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
