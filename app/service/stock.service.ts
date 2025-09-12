// stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiurl } from './environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  url = apiurl.url;

  constructor(private http: HttpClient) {}

  // fetch all products
  public getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/product/`);
  }

  // ✅ fetch all stock
  public getStock(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/product/`);
  }

  // post stock by productId
  public postStock(productId: number, quantity: number): Observable<any> {
    return this.http.post<any>(
      `${this.url}/product/add-stock/${productId}?quantity=${quantity}`,
      {}
    );
  }
}
