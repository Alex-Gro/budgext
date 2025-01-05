import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private jwtService: JwtService) {}

  isAuthenticated(): boolean {
    return !!this.jwtService.getToken();
  }
}
