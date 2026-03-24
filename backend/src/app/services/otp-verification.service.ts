import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpVerificationService {

  private apiUrl = environment.otpApiUrl;

  constructor(private http: HttpClient) {}
  sendOtp(email: string): Observable<any> {
    // console.log("from sop",email)
    return this.http.post(`${this.apiUrl}/send`, { email })
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { email, otp })
  }  
}
