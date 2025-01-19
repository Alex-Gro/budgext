import { Component } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  LINK_LIST = [
    {label: 'Dashboard', path: '/user/dashboard'},
    {label: 'Transactions', path: '/user/transactions'},
    {label: 'Budget', path: '/user/budget'},
    {label: 'User settings', path: '/user/settings'},
  ];
  constructor() {}

}
