import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  constructor(private router: Router) {
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
