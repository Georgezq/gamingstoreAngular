import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../conexion';
import { Reviews } from '../../interfaces/reviewsInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }

  private api = URL_API;

  reviews$: Observable<Reviews[]>;

  countReviewsByGame(gameId: string): Observable<any> {
    return this.http.get(`${URL_API}/reviews/countG/${gameId}`);
  }

  sendReviews(reviews: Reviews): Observable<any>{
   return this.http.post(`${URL_API}reviews`, reviews );
  }

  getReviewsByIdGame(id: string): Observable<any>{
   return this.http.get(`${URL_API}reviews/game/${id}`);
  }

  sendLikeReview(id: string){
    return this.http.get(`${URL_API}reviews/${id}/like`);
  }

  sendDislikeReview(id: string){
    return this.http.get(`${URL_API}reviews/${id}/dislike`);
  }


}
