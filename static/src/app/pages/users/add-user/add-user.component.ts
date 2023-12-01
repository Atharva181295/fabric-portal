import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  userId: number | null;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.userId = null;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    }, {
      validator: this.passwordMatchValidator
    });

    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.userService.getUserById(+this.userId).subscribe(
          (userDetails) => {
            this.userForm.patchValue({
              username: userDetails.username,
              password: '',
              confirm_password: '',
              name: userDetails.name,
              email: userDetails.email
            });
          },
          (error) => {
            console.error('Error fetching user details', error);
          }
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']); 
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe(
          (response) => {
            console.log('User updated successfully', response);
            this.showSnackbar('User updated successfully');
            this.router.navigate(['/users']);
          },
          (error) => {
            console.error('Error updating user', error);
          }
        );
      } else {
        this.userService.addUser(userData).subscribe(
          (response) => {
            console.log('User added successfully', response);
            this.showSnackbar('User added successfully');
            this.router.navigate(['/users']);
          },
          (error) => {
            console.error('Error adding user', error);
          }
        );
      }
    } else {
      this.showSnackbar('Please fill in all required fields and ensure passwords match.');
    }
  }

  private showSnackbar(message: string): void {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.duration = 3000;

    this.snackBar.open(message, 'Close', config);
  }

  // Custom validator for password matching
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirm_password = control.get('confirm_password');

    if (!password || !confirm_password || password.value === confirm_password.value) {
      return null; // Passwords match
    } else {
      return { 'passwordMismatch': true }; // Passwords don't match
    }
  }
}
