import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    MatIcon,
    MatListItemIcon,
    MatTooltip,
    MatDividerModule,
    MatIconButton,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  LINK_LIST = [
    {label: 'Dashboard', path: '/user/dashboard', matIcon: 'dashboard'},
    {label: 'Transactions', path: '/user/transactions', matIcon: 'payments'},
    // {label: 'Budget', path: '/user/budget'},
    // {label: 'User settings', path: '/user/settings'},
  ];
  @Input() isExpanded: boolean = true;
  @Output() toggleMenu = new EventEmitter();
  constructor() {}

}
