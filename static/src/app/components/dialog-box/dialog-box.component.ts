import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-box',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatDividerModule],
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  onYesClick(): void {
    this.dialogRef.close('confirm');
    this.snackBar.open('Deleted Successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }
}
