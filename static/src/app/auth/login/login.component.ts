import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;

  signInForm = new FormGroup({
    user_id: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router) {}

  canSubmit(): boolean {
    return this.signInForm.valid;
  }

  async submit(): Promise<void> {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      // Add the logic to handle the API response
      console.log('API call complete');
      const fcUserId = this.signInForm.get('user_id');
      const fcPasswd = this.signInForm.get('password');
      this.gotoPage('dashboard');
    }, 2000);
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
