import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from '../../conexion';
import { Deseados } from '../../../interfaces/wishlistInterface';

@Injectable({
  providedIn: 'root'
})
export class DeseadosService {

  constructor(private http: HttpClient) { }

  private api = URL_API;

  reviews$: Observable<Deseados[]>;

  //Verificar si está el juego en deseados segun el usuario
  isGameInWishlist(idUsuario: string, idJuego: string): Observable<{ inWishlist: boolean }> {
    return this.http.get<{ inWishlist: boolean }>(`${this.api}/wishlist/${idUsuario}/${idJuego}`);
  }

  getWishListByUser(idUsuario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/wishlistU/${idUsuario}`);
  }

  //Obtener todo el documento de un juego deseado por un usuario

  getWishlistByUserToDate(idUsuario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/wishlistDU/${idUsuario}`);
  }

  //Obtener el conteo de deseados del usuario
  wishlistCount(id:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/wishlistCount/${id}`);
  }

  //Obtener los deseados por juegos

  getWishListByGame(gameId: string): Observable<any> {
    return this.http.get(`${URL_API}/wishlistG/${gameId}`);
  }


  //Agregar y quitar un juego de la lista de deseados de un usuario
  addToWishlist(idUsuario: string, idJuego: string): Observable<any> {
    return this.http.post<any>(`${this.api}/wishlist`, { id_usuario: idUsuario, id_juego: idJuego });
  }

  removeFromWishlist(idUsuario: string, idJuego: string): Observable<any> {
    return this.http.post<any>(`${this.api}/wishlist/remove`, { id_usuario: idUsuario, id_juego: idJuego });
  }

}
