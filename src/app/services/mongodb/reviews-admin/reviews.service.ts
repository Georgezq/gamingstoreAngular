import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../../conexion';
import { Reviews } from '../../../interfaces/reviewsInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }

  private api = URL_API;

  reviews$: Observable<Reviews[]>;

  //Contar las reviews por juegos
  countReviewsByGame(gameId: string): Observable<any> {
    return this.http.get(`${URL_API}reviews/countG/${gameId}`);
  }

  countReviewsByUser(userId: string): Observable<any> {
    return this.http.get(`${URL_API}reviews/countU/${userId}`);
  }

  //Enviar las reviews al API

  sendReviews(reviews: Reviews): Observable<any>{
   return this.http.post(`${URL_API}reviews`, reviews );
  }

  //Obtener las reviews por usuarios y juegos

  getReviewsByIdGame(id: string): Observable<any>{
   return this.http.get(`${URL_API}reviews/game/${id}`);
  }

  getReviewsByIdUser(id: string): Observable<any>{
    return this.http.get(`${URL_API}reviews/user/${id}`)
  }

  getReviewsByUserforGame(id: string): Observable<any>{
    return this.http.get(`${URL_API}reviews/userG/${id}`)
  }

  //Enviar los Likes y dislikes

  likeReview(reviewId: string): Observable<any> {
    return this.http.post(`${URL_API}/reviews/${reviewId}/like`, {});
  }

  dislikeReview(reviewId: string): Observable<any> {
    return this.http.post(`${URL_API}/reviews/${reviewId}/dislike`, {});
  }


}
