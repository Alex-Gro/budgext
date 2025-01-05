import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { UserService } from '../../auth/services/user.service';
import { IfAuthenticatedDirective } from '../../auth/if-authenticated.directive';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage,
    MatButton,
    RouterLink,
    MatToolbar,
    IfAuthenticatedDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  constructor(private userService: UserService) {
    // TODO Make better - abstract this with directive maybe?
    const abc = sessionStorage.getItem('accessToken');
    this.isLoggedIn = !!abc;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.userService.logout();
  }
}
