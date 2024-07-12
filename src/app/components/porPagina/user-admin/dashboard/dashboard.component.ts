import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../services/firebase/auth/auth.service';
import { ReviewsService } from '../../../../services/mongodb/reviews-admin/reviews.service';
import { DeseadosService } from '../../../../services/mongodb/wishlist-admin/deseados.service';
import { JuegosService } from '../../../../services/firebase/games/juegos.service';
import { RouterLink } from '@angular/router';
import { Juegos } from '../../../../interfaces/juegosInterface';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, RouterLink, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [HttpClient, AuthService]

})
export class DashboardComponent implements OnInit{

  auth$ = inject(ReviewsService);
  wishlist$ = inject(DeseadosService);
  juegos$ = inject(JuegosService);


  reviewsList: any[] = [];
  reviewedGameIds: string[] = [];
  reviewedGames: any[] = [];

  wishlistList: any[] = [];
  wishlistGames: any[] = [];
  wishlistGameIds: any[] = [];
  lastAddedGame: Juegos | null = null;

  amigos: string;
  reviews: any;
  deseados: string;
  juegos: string;
  idUser: any;

  ngOnInit(): void {
    const storedData = localStorage.getItem('whentheuserislogged');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.idUser = parsedData.responses.id;

    }

    this.getReviewCount();
    this.getWishlistCount();
    this.getGamesInWishList();
    this.getWishlistForTheDate();
  }


  getReviewCount(): void {
    this.auth$.countReviewsByUser(this.idUser).subscribe(
      (response) => {
        this.reviews = response.reviewCount;
      },
      (error) => {
        console.error('Error al obtener el número de reviews:', error);
      }
    );
  }

  getWishlistCount(): void {

    this.wishlist$.wishlistCount(this.idUser).subscribe(
      (response:any) => {
        this.deseados = response.wishlistCount;
      },
      (error) => {
        console.error('Error al obtener el número de reviews:', error);
      }
    );
  }

  getGamesInWishList(): void {
    this.wishlist$.getWishListByUser(this.idUser).subscribe(
      (response: any) => {
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
      (error) => {
        console.error('Error al obtener la lista de deseos:', error);
      }
    );
  }

  getWishlistForTheDate(): void {
    this.wishlist$.getWishlistByUserToDate(this.idUser).subscribe(
      (response) => {
        // Assuming response is an array of { id: string, created_at: Date }
        const sortedWishlist = response.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const lastAddedGameId = sortedWishlist[0]?.id_juego;

        if (lastAddedGameId) {
          this.juegos$.obtenerJuegoPorId(lastAddedGameId).subscribe(
            (juego) => {
              this.lastAddedGame = juego;
            },
            (error) => {
              console.error('Error al obtener la información del juego:', error);
            }
          );
        } else {
          console.log('No hay juegos en la lista de deseos.');
        }
      },
      (error) => {
        console.error('Error al obtener la lista de deseos:', error);
      }
    );
  }

}
