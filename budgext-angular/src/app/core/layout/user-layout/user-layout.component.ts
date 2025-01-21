import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';

@Component({
  selector: 'app-user-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
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
