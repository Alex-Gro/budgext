import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage,
    MatButton,
    RouterLink,
    MatToolbar,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  // TODO Implement logout method
  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
