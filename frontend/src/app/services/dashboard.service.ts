import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  url: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getDetails() {
    return this.http.get(`${this.url}/dashboard/details`);
  }
}
