import { Component, OnInit, inject } from '@angular/core';
import { DeseadosService } from '../../../../services/wishlist-admin/deseados.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { JuegosService } from '../../../../services/games/juegos.service';
import { Juegos } from '../../../../interfaces/juegosInterface';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [AsyncPipe, RouterLink, NgIf, NgFor],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  userId: string;
  gameId: string;
  wishlist: string[] = []; // Cambio el tipo a string[]
  juegosDetails$: Observable<Juegos[]>; // Observable de array de Juegos

  auth$ = inject(AuthService);
  wishlist$ = inject(DeseadosService);
  games$ = inject(JuegosService);

  ngOnInit(): void {
    this.getIdUser()
    this.getMyWishlist();
  }

  getIdUser(): void {
    const storedData = localStorage.getItem('whentheuserislogged');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.userId = parsedData.responses.id;
      this.getMyWishlist();
    }
  }

  getMyWishlist(): void {
    console.log('Getting wishlist for user:', this.userId);
    this.juegosDetails$ = this.wishlist$.getWishListByUser(this.userId).pipe(
      tap(wishlistItems => console.log('Wishlist items:', wishlistItems)),
      switchMap(wishlistItems => {
        this.wishlist = wishlistItems.map(item => item.id_juego);
        console.log('Game IDs in wishlist:', this.wishlist);
        return this.obtenerDetallesDeJuegos();
      }),
      catchError(error => {
        console.error('Error al obtener la lista de deseados:', error);
        return of([]);
      })
    );

    // Suscríbete aquí para asegurarte de que se ejecute
    this.juegosDetails$.subscribe(
      juegos => console.log('Juegos details:', juegos),
      error => console.error('Error in juegosDetails$:', error)
    );
  }

  obtenerDetallesDeJuegos(): Observable<Juegos[]> {
    if (this.wishlist.length === 0) {
      return of([]);
    }
    const requests = this.wishlist.map(juegoId =>
      this.games$.obtenerJuegoPorId(juegoId).pipe(
        catchError(error => {
          console.error(`Error al obtener detalles del juego ${juegoId}:`, error);
          return of(null);
        })
      )
    );
    return forkJoin(requests).pipe(
      map(juegos => juegos.filter(juego => juego !== null)),
      tap(juegos => console.log('Detalles de juegos:', juegos))
    );
  }

  playVideo(event: MouseEvent): void {
    const video = (event.currentTarget as HTMLElement).querySelector('video') as HTMLVideoElement;
    if (video) {
      video.muted = true; // Asegura que el video esté silenciado
      video.play().catch((error) => {
        console.error('Error al reproducir el video:', error);
      });
    }
  }

  pauseVideo(event: MouseEvent): void {
    const video = (event.currentTarget as HTMLElement).querySelector('video') as HTMLVideoElement;
    if (video) {
      video.pause();
    }
  }


  lazyLoadImage(event: Event): void {
    const img = event.target as HTMLImageElement;
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) {
      img.src = dataSrc;
    }
  }



}
