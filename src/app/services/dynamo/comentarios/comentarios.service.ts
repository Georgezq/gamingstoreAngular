import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../conexion';
import { Comentarios } from '../../../interfaces/comentariosInterface';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  constructor(private http: HttpClient) { }

  private api = API;

  getNoticias() {
    return this.http.get<any>(`${this.api}comentario`);
  }

  sendNews(comentario: Comentarios){
    return this.http.post(`${this.api}comentario`, comentario);
  }



}
