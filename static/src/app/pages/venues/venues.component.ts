import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent {

  constructor(private router: Router) {
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }

}
