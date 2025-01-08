import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { User } from '../user.model';

/**
 * Provides the interface of the response after a token gets requested
 */
export interface UserAuthResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** Holds the current user (state), initially null */
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /** Exposes the currentUser observable, emitting only distinct values */
  public currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  /** Checks if a user is authenticated (based on currentUser) */
  public userAuthenticated = this.currentUser$.pipe(map((user) => !!user));

  constructor(private http: HttpClient,
              private jwtService: JwtService,
              private router: Router) {}

  /**
   * Signs up a new user with the provided email and password.
   * If the signup is successful, the authentication data (JWT token and user) is saved.
   * @param email - The email address of the user
   * @param password - The password chosen by the user
   * @returns Observable - Emits the response containing authentication data (JWT token and user)
   */
  signup(email: string, password: string): Observable<any> {
    return this.http.post<UserAuthResponse>('/auth/signup', {email, password})
      .pipe(tap((res: UserAuthResponse) => {
        this.setAuth(res);
      }));
  }

  /**
   * Logs in a user if credentials are correct (email, password).
   * Calls {@link setAuth} to save possible sensitive data (jwt, user)
   * @param email - Email entered by the user
   * @param password - Password entered by the user
   * @returns Observable - Emits the response containing authentication data (JWT token and user)
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
   * Fetches the current user from the backend.
   * If the request is successful, updates the current user state.
   * If an error occurs, purges the authentication data (e.g., JWT, user).
   *
   * @returns Observable<User> - Emits the current user data if the request is successful.
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/users/getUser').pipe(
      tap({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.purgeAuth()
        },
      }),
      shareReplay(1), // Shares the last response with all subscriptions
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
