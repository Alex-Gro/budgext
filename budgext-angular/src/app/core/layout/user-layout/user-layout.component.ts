import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';

@Component({
  selector: 'app-user-layout',
  imports: [
    RouterOutlet,
    SidebarComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  public isExpanded: boolean = true;

  constructor() {}

  public toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }
}
