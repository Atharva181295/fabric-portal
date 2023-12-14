import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from './projects.service';
import { Router } from '@angular/router';
import { EditProjectDialogComponent } from '../../components/edit-project-dialog/edit-project-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements AfterViewInit {
  projects: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.updatePaginator();
  }

  private updatePaginator(): void {
    this.projectsService.getProjects().subscribe((response: any) => {
      this.projects = response.projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        code: project.code,
        start_date: project.start_date,
        end_date: project.end_date,
        description: project.description,
      }));

      this.dataSource = new MatTableDataSource<any>(this.projects);
      this.dataSource.paginator = this.paginator;
      this.paginator.length = this.projects.length;
      this.paginator.pageIndex = 0;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  editProject(project: any): void {
    this.projectsService.getProjectById(project.id).subscribe(
      (projectDetails) => {
        const dialogRef = this.dialog.open(EditProjectDialogComponent, {
          width: '350px',
          data: { project: projectDetails, projectId: project.id },
        });

        dialogRef.componentInstance.onUpdateProject.subscribe(
          (updatedProject: any) => {
            const index = this.projects.findIndex(
              (p) => p.id === updatedProject.projectId
            );
            if (index !== -1) {
              this.projects[index] = {
                ...this.projects[index],
                ...updatedProject.projectData,
              };
              this.dataSource.data = this.projects;
            }
          }
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed with result:', result);
        });
      },
      (error) => {
        console.error('Error fetching project details', error);
      }
    );
  }

  deleteProject(project: any): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this project?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.projectsService.deleteProject(project.id).subscribe(
          () => {
            this.updatePaginator();
          },
          (error) => {
            console.error('Error deleting project', error);
          }
        );
      }
    });
  }
}
