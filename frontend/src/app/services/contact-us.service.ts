import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http:HttpClient) { }

  baseUrl = environment.baseApiUrl;

  contactUsForm(formData:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/contact-us`,formData)
  }
}
