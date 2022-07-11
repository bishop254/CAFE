import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  url: string = environment.apiURL;
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  generateReport(data: any) {
    return this.http.post(
      `${this.url}/bill/generateReport`,
      data,
      this.jsonHeader
    );
  }

  getPDF(data: any): Observable<Blob> {
    return this.http.post(`${this.url}/bill/getPDF`, data, {
      responseType: 'blob',
    });
  }
}
