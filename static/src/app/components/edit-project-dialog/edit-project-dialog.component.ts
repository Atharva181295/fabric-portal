import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.data.name, Validators.required],
      code: [this.data.code, Validators.required],
      start_date: [this.data.start_date, Validators.required],
      end_date: [this.data.end_date, Validators.required],
      description: [this.data.description, Validators.required],
      // Add other fields as needed
    });
  }

  onSaveClick(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
