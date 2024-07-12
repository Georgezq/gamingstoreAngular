import { Component, OnInit, inject } from '@angular/core';
import { UsersAdminService } from '../../../services/mongodb/users/users-admin.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewsService } from '../../../services/mongodb/reviews-admin/reviews.service';
import { JuegosService } from '../../../services/firebase/games/juegos.service';
import { DeseadosService } from '../../../services/mongodb/wishlist-admin/deseados.service';
import { NgIf } from '@angular/common';
import { DefaultProfileImageDirective } from '../../../directivas/default-profile-image.directive';
import { Title } from '@angular/platform-browser';
import { ToggleServiceService } from '../../../services/toggle-service.service';

@Component({
  selector: 'app-user-page-visitante',
  standalone: true,
  imports: [NgIf, RouterLink, DefaultProfileImageDirective],
  templateUrl: './user-page-visitante.component.html',
  styleUrl: './user-page-visitante.component.css'
})
export class UserPageVisitanteComponent implements OnInit {

  users$ = inject(UsersAdminService);
  route$ = inject(ActivatedRoute);
  reviews$ = inject(ReviewsService);
  juegos$ = inject(JuegosService);
  wishlist$ = inject(DeseadosService);
  title$ = inject(Title);
  _toggleSerive = inject(ToggleServiceService);


  reviews: any;
  idUser: any;
  deseados: any;
  verPreview: boolean = true;
  juegosList: any[] = [];

  reviewsList: any[] = [];
  reviewedGameIds: string[] = [];
  reviewedGames: any[] = [];

  wishlistList: any[] = [];
  wishlistGames: any[] = [];
  wishlistGameIds: any[] = [];

  fechaVisitante: string;
  photoUrlVisitante: string;
  displayNameVisitante: string;
  usuarioIdVisitante: string;
  discordVisitante: string;
  steamVisitante: string;
  youtubeVisitante: string;
  emailVisitante: string;
  userId = this.route$.snapshot.paramMap.get('id');



  getUsers() {
    this.users$.getUserById(this.userId).subscribe((res) => {
      const fechaVisitante = res.fechacreacion;
      this.photoUrlVisitante = res.imagenperfil;
      this.discordVisitante = res.redesSociales.discord;
      this.steamVisitante = res.redesSociales.steam;
      this.youtubeVisitante = res.redesSociales.youtube;
      this.emailVisitante = res.email;

      const correo = res.email;
      const nameUser = res.displayName;
      if(res.displayName == '') {
        this.displayNameVisitante = correo.split('@')[0];
      } else {
        this.displayNameVisitante = nameUser;
      }

      this.title$.setTitle(`Perfil de ${this.displayNameVisitante}`)


      // Crear una instancia de Date a partir de la fecha almacenada
      const fechaDate = new Date(fechaVisitante);

      // Opciones de formato para toLocaleDateString()
      const opciones: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };

      // Formatear la fecha utilizando toLocaleDateString()
      this.fechaVisitante = fechaDate.toLocaleDateString('es-ES', opciones);

    });
  }

  getReviewCount(): void {

    this.reviews$.countReviewsByUser(this.userId).subscribe(
      (response) => {
        this.reviews = response.reviewCount;
      },
      (error) => {
        console.error('Error al obtener el número de reviews:', error);
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

  getReviewsByUser(): void {
    this.reviews$.getReviewsByIdUser(this.userId).subscribe(
      (response) => {
        this.reviewsList = response;
       // console.log(this.reviewsList);

        this.reviews$.getReviewsByUserforGame(this.userId).subscribe(
          (res) => {
        //    console.log(res);
            this.reviewedGameIds = res;

            // Iterar sobre los IDs de los juegos y obtener la información de cada juego
            this.reviewedGameIds.forEach(id => {
              this.juegos$.obtenerJuegoPorId(id).subscribe(
                (juego) => {
                // console.log(juego);
                  this.reviewedGames.push(juego);
                },
                (error) => {
                  console.error('Error al obtener la información del juego:', error);
                }
              );
            });
          },
          (error) => {
            console.error('Error al obtener los IDs de juegos revisados:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener el número de reviews:', error);
      }
    );
  }


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

  ngOnInit(): void {

    const storedData = localStorage.getItem('whentheuserislogged');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.idUser = parsedData.responses.id;
    }

    this._toggleSerive.currentState.subscribe(state => {
      this.verPreview = state;
    });

    this.getUsers();
    this.getReviewCount();
    this.getWishlistCount();
    this.getReviewsByUser();
    this.getGamesInWishList();
  }

}
