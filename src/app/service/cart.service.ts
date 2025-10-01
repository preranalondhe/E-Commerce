import { Injectable } from '@angular/core';
import { apiurl } from './environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  imagePaths: string;
  discountPercent: number;   // ✅ added
  colour?: string;           // optional
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size?: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  url = apiurl.url;

  constructor(private httpClient: HttpClient) {}

  getMyCart(): Observable<Cart> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Cart>(`${this.url}/cart/mycart`, { headers });
  }

  // ✅ Fix: backend expects a list, so wrap request in an array
  addToCart(request: { productId: number; quantity: number; size?: string }): Observable<CartItem[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<CartItem[]>(`${this.url}/cart/add`, [request], { headers });
  }
}
