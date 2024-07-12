import { Injectable } from '@angular/core';
import { URL_API } from '../../conexion';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersAdminService {

  constructor(private http: HttpClient) { }

  private api = URL_API;

  getUserById(id: string): any {
    return this.http.get(`${this.api}/usuario/${id}`);
  }


}
