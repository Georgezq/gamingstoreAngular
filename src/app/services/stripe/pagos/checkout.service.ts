import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API, API_KEY_STRIPE,  } from '../../conexion';
import { Juegos } from '../../../interfaces/juegosInterface';
import { loadStripe } from '@stripe/stripe-js';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly _http = inject(HttpClient);
  private readonly _url = API;

  constructor() { }

  onProceedToPay(juegos: Juegos[], userId: string) {
    return this._http.post(`${this._url}/checkout`, { items: juegos, userId: userId }).subscribe({
      next: async (res: any) => {
        const stripe = await loadStripe(API_KEY_STRIPE);
        stripe?.redirectToCheckout({ sessionId: res.id });
      },
      error: (err) => {
        console.error('Error', err);
      }
    });
  }

}
