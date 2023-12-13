import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;
  hidePassword = true;
  
  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  canSubmit(): boolean {
    return this.signInForm.valid;
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      return;
    }

    try {
      const username = this.signInForm.get('username')?.value || '';
      const password = this.signInForm.get('password')?.value || '';

      await new Promise((resolve) => setTimeout(resolve, 500));

      const loginSuccess = await this.authService.login(username, password);

      if (loginSuccess) {
        this.showSnackBar('Login Successful');
        this.gotoPage('dashboard');
        console.log('Login Success');
      } else {
        this.showSnackBar('User credentials are incorrect');
        console.error('Login failed');
      }
    } finally {}
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault(); // Prevent any default behavior
    this.hidePassword = !this.hidePassword;
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
