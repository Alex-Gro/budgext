import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';
import { UserService } from '../../auth/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../auth/user.model';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

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
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  LINK_LIST = [
    {label: 'Dashboard', path: '/user/dashboard', matIcon: 'dashboard'},
    {label: 'Transactions', path: '/user/transactions', matIcon: 'payments'},
    // {label: 'Budget', path: '/user/budget'},
    // {label: 'User settings', path: '/user/settings'},
  ];

  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  public currentUser: User | null = null;

  @Input() isExpanded: boolean = true;
  @Output() toggleMenu = new EventEmitter();
  constructor(private userService: UserService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userService.currentUser$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  logout(): void {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
