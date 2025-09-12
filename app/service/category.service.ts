import { Injectable } from '@angular/core';
import { apiurl } from './environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
url=apiurl.url;

 
   constructor(private httpClient:HttpClient) { }
 
 
   public getCategory(){
    return this.httpClient.get(`${this.url}/category/getcategory`)
   }
   public postCategory(data:any)
   {
    return this.httpClient.post(`${this.url}/category/postcategory`,data)
   }
 
}
