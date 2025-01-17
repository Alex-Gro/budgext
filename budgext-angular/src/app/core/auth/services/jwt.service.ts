import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor() { }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  destroyToken(): void {
    localStorage.removeItem('accessToken');
  }
}
