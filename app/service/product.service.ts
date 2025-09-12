import { Injectable } from '@angular/core';
import { apiurl } from './environment';
import { HttpClient } from '@angular/common/http';

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
  public postProduct(data:any)
  {
    return this.httpClient.post(`${this.url}/product/addproduct`,data)
  }
}