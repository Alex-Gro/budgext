import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = 'http://localhost:3333/auth/login';
    const body = {
      email: email,
      password: password
    };
    return this.http.post(url, body);
  }
}
