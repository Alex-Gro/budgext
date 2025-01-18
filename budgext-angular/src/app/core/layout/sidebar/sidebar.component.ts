import { Component } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  LINK_LIST = [
    {label: 'Dashboard', path: '/user/dashboard', isActive: true},
    {label: 'Transactions', path: '/user/transactions', isActive: false},
    {label: 'Budget', path: '/user/budget', isActive: false},
    {label: 'User settings', path: '/user/settings', isActive: false},
  ];
  constructor() {}

  trackByFn(index: number, link: any): string {
    return link.path;
  }
}
