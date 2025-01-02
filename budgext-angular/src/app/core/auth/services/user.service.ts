import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

export interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,
              private jwtService: JwtService,
              private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>('/api/auth/login', {email, password})
      .pipe(tap((res: LoginResponse) => {
        this.setAuth(res.access_token);
    }));
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(['/']);
  }

  setAuth(token: string): void {
    this.jwtService.saveToken(token);
    // TODO The signed up user has to be saved in some form of BehaviourSubject
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    // TODO The signed up user Behaviour Subject should be nulled here (next[null])
  }
}
