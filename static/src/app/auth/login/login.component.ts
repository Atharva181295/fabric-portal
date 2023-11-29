import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  canSubmit(): boolean {
    return this.signInForm.valid;
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      return;
    }
  
    this.loading = true;
  
    try {
      const username = this.signInForm.get('username')?.value || ''; 
      const password = this.signInForm.get('password')?.value || '';  
  
      const loginSuccess = await this.authService.login(username, password);
  
      if (loginSuccess) {
        this.gotoPage('dashboard');
      } else {
        console.error('Login failed');
      }
    } finally {
      this.loading = false;
    }
  }
  
  

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
