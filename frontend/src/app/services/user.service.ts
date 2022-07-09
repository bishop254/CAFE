import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiURL;

  constructor(private http: HttpClient) {}

  signup(data: any) {
    return this.http.post(`${this.url}/user/signup`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
