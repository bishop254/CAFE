import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url: string = environment.apiURL;
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  add(data: any) {
    return this.http.post(`${this.url}/product/add`, data, this.jsonHeader);
  }

  update(data: any) {
    return this.http.patch(`${this.url}/product/update`, data, this.jsonHeader);
  }

  getProducts() {
    return this.http.get(`${this.url}/product/get`);
  }

  updateStatus(data: any) {
    return this.http.patch(
      `${this.url}/product/updateStatus`,
      data,
      this.jsonHeader
    );
  }

  delete(id: any) {
    return this.http.delete(
      `${this.url}/product/delete/${id}`,
      this.jsonHeader
    );
  }

  getProductsByCategory(id: any) {
    return this.http.get(`${this.url}/product/getByCategoryID/${id}`);
  }

  getById(id: any) {
    return this.http.get(`${this.url}/product/getByID/${id}`);
  }
}
