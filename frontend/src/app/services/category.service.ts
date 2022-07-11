import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url: string = environment.apiURL;
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  add(data: any) {
    return this.http.post(`${this.url}/category/add`, data, this.jsonHeader);
  }

  update(data: any) {
    return this.http.patch(`${this.url}/category/update`, data, this.jsonHeader);
  }

  getCategories() {
    return this.http.get(`${this.url}/category/get/`);
  }
}
