import { Injectable } from '@angular/core';
import { apiurl } from './environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url=apiurl.url


  constructor(private httpClient:HttpClient) { }
  
  public getProduct()
  {
    return this.httpClient.get(`${this.url}/product/`)
  }
  public postProduct(data: any) {
  return this.httpClient.post(
    `${this.url}/product/addproduct`,
    data,
    { headers: { "Content-Type": "application/json" } }  // 👈 Force JSON
  );
}

    getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/product/category/${categoryId}`);
  }
  

  getProductReviews(productId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/product/${productId}`);
  }

  filterProducts(
  color?: string, minPrice?: number, maxPrice?: number, sort?: string,
  brand?: string, discountPercent?: number
): Observable<any[]> {
  let params = new HttpParams();
  if (color) params = params.set('color', color);
  if (minPrice) params = params.set('minPrice', minPrice);
  if (maxPrice) params = params.set('maxPrice', maxPrice);
  if (sort) params = params.set('sort', sort);
  if (brand) params = params.set('brand', brand);
  if (discountPercent) params = params.set('discountPercent', discountPercent);
  return this.httpClient.get<any[]>(`${this.url}/filter`, { params });
}
getProductById(id: number): Observable<any> {
  return this.httpClient.get(`${this.url}/product/${id}`);
}

updateProduct(id: number, product: any, images: File[]): Observable<any> {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  images.forEach(file => formData.append('images', file));

  return this.httpClient.put(`${this.url}/product/update/${id}`, formData);
}

}