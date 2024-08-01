import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../conexion';
import { Comentarios } from '../../../interfaces/comentariosInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  constructor(private http: HttpClient) { }

  private api = API;

  getCommentsByNewID() {
    return this.http.get<any>(`${this.api}comentario`);
  }

  sendComments(comentario: Comentarios){
    return this.http.post(`${this.api}comentario`, comentario);
  }

  getComentariosByNewsId(newsId: string): Observable<any> {
    return this.http.get(`${this.api}comentario/${newsId}`);
  }





}
