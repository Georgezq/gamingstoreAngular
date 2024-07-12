import { Component, OnInit, inject } from '@angular/core';
import { DeseadosService } from '../../../../services/mongodb/wishlist-admin/deseados.service';
import { AuthService } from '../../../../services/firebase/auth/auth.service';
import { Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { JuegosService } from '../../../../services/firebase/games/juegos.service';
import { Juegos } from '../../../../interfaces/juegosInterface';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewsService } from '../../../../services/mongodb/reviews-admin/reviews.service';
import { ToggleServiceService } from '../../../../services/toggle-service.service';

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
  allGamesID: any;
  wishlist: string[] = []; // Cambio el tipo a string[]
  deseados: any;
  juegosDetails$: Observable<Juegos[]>; // Observable de array de Juegos
  loading = true; // Bandera para controlar el estado de carga
  verPreview: boolean = true; 

  auth$ = inject(AuthService);
  wishlist$ = inject(DeseadosService);
  juegos$ = inject(JuegosService);
  reviews$ = inject(ReviewsService);
  _toggleSerive = inject(ToggleServiceService);



  wishlistList: any[] = [];
  wishlistGames: any[] = [];
  wishlistGameIds: any[] = [];

  ngOnInit(): void {
    this.getIdUser();
    this.getWishlistCount();
    this.getGamesInWishList();

    this._toggleSerive.currentState.subscribe(state => {
      this.verPreview = state;
    }); 
  }

  getIdUser(): void {
    const storedData = localStorage.getItem('whentheuserislogged');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.userId = parsedData.responses.id;
    }
  }

  getGamesInWishList(): void {
    this.wishlist$.getWishListByUser(this.userId).subscribe(
      (response) => {
        this.wishlistGameIds = response;
        this.wishlistGameIds.forEach(id => {
          this.juegos$.obtenerJuegoPorId(id).subscribe(
            (juego) => {
              this.wishlistGames.push(juego);
            },
            (error) => {
              console.error('Error al obtener la información del juego:', error);
            }
          );
        });
      },
      () => {
      }
    );
  }

  getWishlistCount(): void {

    this.wishlist$.wishlistCount(this.userId).subscribe(
      (response:any) => {
        this.deseados = response.wishlistCount;
      },
      (error) => {
        console.error('Error al obtener el número de reviews:', error);
      }
    );
  }


  //Para mostrar los videos de los juegos

  playVideo(event: MouseEvent): void {
    if(this.verPreview == true){
      const video = (event.currentTarget as HTMLElement).querySelector('video') as HTMLVideoElement;
      if (video) {
        video.muted = true; // Asegura que el video esté silenciado
        video.play().catch((error) => {
          console.error('Error al reproducir el video:', error);
        });
      }
    } else {
      return;
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
