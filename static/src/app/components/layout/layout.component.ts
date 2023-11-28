import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit{

  username: string = 'admin'

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    
  }

  async logout(): Promise<void> {
    this.gotoPage('login');
  }

  gotoPage(pageName: string): void {
    this.router.navigate([pageName]);
  }

}
