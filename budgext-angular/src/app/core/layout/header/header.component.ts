import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { UserService } from '../../auth/services/user.service';
import { IfAuthenticatedDirective } from '../../auth/if-authenticated.directive';
import { User } from '../../auth/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    MatButton,
    RouterLink,
    MatToolbar,
    IfAuthenticatedDirective,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  public currentUser: User | null = null;
  public userRoute: boolean = false;

  constructor(private userService: UserService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.pipe(takeUntil(this._ngUnsubscribe)).subscribe(url => {
      this.userRoute = url.length > 0 && url[0].path === 'user';
    });

    this.userService.currentUser$.pipe(takeUntil(this._ngUnsubscribe))
    .subscribe((user) => this.currentUser = user || null);
  }

  logout(): void {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
