import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Juegos } from '../../../interfaces/juegosInterface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  constructor(private http: HttpClient) { }

  agregarAlCarrito(idUsuario: string, idJuego: string, estado: boolean): Observable<any> {
    return this.http.post(`${URL_API}carrito`, { id_usuario: idUsuario, id_juego: idJuego, estado: estado });
  }

  eliminarDelCarrito(idUsuario: string, idJuego: string): Observable<any> {
    return this.http.delete(`${URL_API}remove/${idUsuario}/${idJuego}`);
  }

  obtenerCarrito(userId: string): Observable<any> {
    return this.http.get(`${URL_API}carrito/${userId}`)
  }

  obtenerCompradosById(userId: string): Observable<any> {
    return this.http.get(`${URL_API}comprados/${userId}`)
  }

  obtenerCarritoEstado(userId: string): Observable<any> {
    return this.http.get(`${URL_API}carrito_estado/${userId}`)
  }

  obtenerCountByUser(userId: string): Observable<any> {
    return this.http.get(`${URL_API}countU/${userId}`);
  }

  obtenerCountComprados(userId: string): Observable<any> {
    return this.http.get(`${URL_API}countG/${userId}`);
  }


}
