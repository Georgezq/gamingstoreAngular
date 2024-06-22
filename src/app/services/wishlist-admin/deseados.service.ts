import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from '../conexion';
import { Deseados } from '../../interfaces/wishlistInterface';

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

  getWishListByGame(gameId: string): Observable<any> {
    return this.http.get(`${URL_API}/wishlistG/${gameId}`);
  }

  addToWishlist(idUsuario: string, idJuego: string): Observable<any> {
    return this.http.post<any>(`${this.api}/wishlist`, { id_usuario: idUsuario, id_juego: idJuego });
  }

  removeFromWishlist(idUsuario: string, idJuego: string): Observable<any> {
    return this.http.post<any>(`${this.api}/wishlist/remove`, { id_usuario: idUsuario, id_juego: idJuego });
  }

}
