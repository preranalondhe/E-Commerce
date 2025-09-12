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
  colour?: string;           // optional, since backend has it
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
    const token = localStorage.getItem('jwtToken'); // or sessionStorage

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Cart>("http://localhost:4040/cart/mycart", { headers });
  }
}
