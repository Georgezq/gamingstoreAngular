import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API, API_KEY_STRIPE,  } from '../../conexion';
import { Juegos } from '../../../interfaces/juegosInterface';
import { loadStripe } from '@stripe/stripe-js';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly _http = inject(HttpClient);
  private readonly _url = API;

  constructor() { }

  onProceedToPay(juegos: Juegos[], userId: string) {
    return this._http.post(`${this._url}/checkout`, {items: juegos, userId: userId}).pipe(
      map(async(res:any) => {
        const stripe = await loadStripe(API_KEY_STRIPE);
        stripe?.redirectToCheckout({ sessionId: res.id });
      })
    ).subscribe({
      error: (err) => {
        console.error('Error',err);
      }
    })
  }
}
