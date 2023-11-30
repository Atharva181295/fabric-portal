import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ProjectsService } from './../projects.service'; // Make sure to import the correct service
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common'; // Import DatePipe

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm!: FormGroup;
  projectId: number | null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectsService, // Make sure to use the correct service
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.projectId = null;
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      description: ['', [Validators.required]]
    }, {
      validator: this.dateRangeValidator
    });

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

  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;

      // Format dates using Angular's DatePipe
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

  private showSnackbar(message: string): void {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.duration = 3000;

    this.snackBar.open(message, 'Close', config);
  }

  // Custom validator for date range
  private dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.get('start_date');
    const endDate = control.get('end_date');

    if (!startDate || !endDate || new Date(startDate.value) <= new Date(endDate.value)) {
      return null; // Date range is valid
    } else {
      return { 'invalidDateRange': true }; // Date range is invalid
    }
  }

  // Format date using Angular's DatePipe
  private formatDate(date: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(new Date(date), 'yyyy-MM-dd') || '';
  }
}
