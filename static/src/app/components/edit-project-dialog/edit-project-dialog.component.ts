import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../../pages/projects/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit {
  editForm!: FormGroup;
  public onUpdateProject: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const projectData = this.data.project.data.project;
    this.editForm = this.fb.group({
      name: [projectData.name],
      code: [projectData.code],
      start_date: [projectData.start_date],
      end_date: [projectData.end_date],
      description: [projectData.description],
    });
  }

  onSaveClick(): void {
    if (this.editForm.valid) {
      const projectData = this.editForm.value;
      const projectId = this.data.projectId;


      projectData.start_date = this.formatDate(projectData.start_date);
      projectData.end_date = this.formatDate(projectData.end_date);

      this.projectService.updateProject(projectId, projectData).subscribe(
        (response) => {
          console.log('Project updated successfully', response);

          this.snackBar.open('Project updated successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });

          this.onUpdateProject.emit({ projectId, projectData });
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error updating project', error);

          this.snackBar.open('Error updating project', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      );
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  private formatDate(date: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(new Date(date), 'yyyy-MM-dd') || '';
  }
}
