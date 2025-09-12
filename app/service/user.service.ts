import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from './environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  api = apiurl.url;

  constructor(private httpClient: HttpClient) { }


  registerUser(user: any) {
    console.log("url",this.api);
    
    return this.httpClient.post(`${this.api}/register`, user);
  }
  findAllUser(){
    return this.httpClient.get(`${this.api}/alluser`)
  }

}
