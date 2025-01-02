import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor() { }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  saveToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }

  destroyToken(): void {
    sessionStorage.removeItem('accessToken');
  }
}
