import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = environment.authTokenApiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password })
  }

  // sendOtp(email: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/sendOtp`, { email }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // verifyOtp(email: string, otp: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/verifyOtp`, { email, otp }).pipe(
  //     catchError(this.handleError)
  //   );
  // }  

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('username');
  }
}