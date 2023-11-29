import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;

  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService, public dialog: MatDialog) { }


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

      // Simulate a delay (1 second) for the login process
      await new Promise(resolve => setTimeout(resolve, 500));

      const loginSuccess = await this.authService.login(username, password);

      if (loginSuccess) {
        this.gotoPage('dashboard');
        console.log('Login Success');

      } else {
        console.error('Login failed');
      }
    } finally {
    }
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
