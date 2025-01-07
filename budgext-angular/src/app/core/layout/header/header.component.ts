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
  constructor(private userService: UserService) {}

  logout(): void {
    this.userService.logout();
  }
}
