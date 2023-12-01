import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ProjectsService } from './../projects.service'; 
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm!: FormGroup;
  projectId: number | null;
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectsService, 
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.projectId = null;
  }

  ngOnInit(): void {
    this.initializeProjectForm();
    this.getUserInfo();
  
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.projectService.getProjectById(+this.projectId).subscribe(
          (projectDetails) => {
            this.projectForm.patchValue({
              name: projectDetails.name,
              code: projectDetails.code,
              start_date: projectDetails.start_date,
              end_date: projectDetails.end_date,
              description: projectDetails.description
            });
          },
          (error) => {
            console.error('Error fetching project details', error);
          }
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']); 
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;

      projectData.start_date = this.formatDate(projectData.start_date);
      projectData.end_date = this.formatDate(projectData.end_date);

      if (this.projectId) {
        this.projectService.updateProject(this.projectId, projectData).subscribe(
          (response) => {
            console.log('Project updated successfully', response);
            this.showSnackbar('Project updated successfully');
            this.router.navigate(['/projects']);
          },
          (error) => {
            console.error('Error updating project', error);
          }
        );
      } else {
        this.projectService.addProject(projectData).subscribe(
          (response) => {
            console.log('Project added successfully', response);
            this.showSnackbar('Project added successfully');
            this.router.navigate(['/projects']);
          },
          (error) => {
            console.error('Error adding project', error);
          }
        );
      }
    } else {
      this.showSnackbar('Please fill in all required fields and ensure the date range is valid.');
    }
  }

  async getUserInfo() {
    try {
      const userInfo = await this.authService.getUserInfo();
      this.userInfo = userInfo.id;
      console.log('User Info:', this.userInfo);
  
      // Check if projectForm is not initialized
      if (!this.projectForm) {
        this.initializeProjectForm();
      }
  
      // Update the user property in the projectForm after getting the user information
      this.projectForm.patchValue({
        user: this.userInfo,
      });
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }
  
  private initializeProjectForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      user: this.userInfo,
    }, {
      validator: this.dateRangeValidator
    });
  }

  private showSnackbar(message: string): void {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.duration = 3000;

    this.snackBar.open(message, 'Close', config);
  }

  private dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.get('start_date');
    const endDate = control.get('end_date');

    if (!startDate || !endDate || new Date(startDate.value) <= new Date(endDate.value)) {
      return null; 
    } else {
      return { 'invalidDateRange': true };
    }
  }

  // Format date using Angular's DatePipe
  private formatDate(date: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(new Date(date), 'yyyy-MM-dd') || '';
  }
}
