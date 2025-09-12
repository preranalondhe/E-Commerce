import { Injectable } from '@angular/core';
import { apiurl } from './environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
url=apiurl.url;
  constructor(private httpClient:HttpClient) { }

  public getOrders()
  {
    return this.httpClient.get(`${this.url}/order/getallorders`)
  }
  public postOrders(data:any)
  {
    return this.httpClient.post(`${this.url}/order/placeorder`,data)
  }
}
