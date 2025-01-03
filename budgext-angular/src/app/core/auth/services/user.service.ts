import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { User } from '../user.model';

export interface UserAuthResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient,
              private jwtService: JwtService,
              private router: Router) {}

  /**
   * Logs in a user if credentials are correct (email, password).
   * Calls {@link setAuth} to save possible sensitive data (jwt, user)
   * @param email - Email entered by the user
   * @param password - Password entered by the user
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<UserAuthResponse>('/auth/login', {email, password})
      .pipe(tap((res: UserAuthResponse) => {
        this.setAuth(res);
    }));
  }

  /**
   * Logout the current user, clear sensitive data and navigate to home
   */
  logout(): void {
    this.purgeAuth();
    void this.router.navigate(['/']);
  }

  /**
   * Requests the current user from the backend.
   * If an error occurs, all gets purged
   */
  getCurrentUser(): Observable<{user: User}> {
    return this.http.get<{user: User}>('/users/getUser').pipe(
      tap({
        next: ({user}) => this.currentUserSubject.next(user),
        error: () => this.purgeAuth(),
      }),
    );
  }

  /**
   * Saves the jwt token and the current user
   * @param userAuthResponse Contains the jwt token and user
   */
  setAuth(userAuthResponse: UserAuthResponse): void {
    this.jwtService.saveToken(userAuthResponse.access_token);
    this.currentUserSubject.next(userAuthResponse.user)
  }

  /**
   * Clears out the token and current user
   */
  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}
