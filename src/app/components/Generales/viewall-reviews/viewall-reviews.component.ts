import { Component, inject, OnInit } from '@angular/core';
import { ToggleServiceService } from '../../../services/toggle-service.service';
import { ReviewsService } from '../../../services/mongodb/reviews-admin/reviews.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/firebase/auth/auth.service';
import { DefaultProfileImageDirective } from '../../../directivas/default-profile-image.directive';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { JuegosService } from '../../../services/firebase/games/juegos.service';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

@Component({
  selector: 'app-viewall-reviews',
  standalone: true,
  imports: [RouterLink, DefaultProfileImageDirective, SlicePipe, AsyncPipe, TruncatePipe],
  templateUrl: './viewall-reviews.component.html',
  styleUrl: './viewall-reviews.component.css'
})
export class ViewallReviewsComponent implements OnInit{

  _toggleSerive = inject(ToggleServiceService);
  reviews$ = inject(ReviewsService);
  usuarios$ = inject(AuthService);
  juegos$ = inject(JuegosService);


  verPreview: boolean = true;
  reviews: any[] = [];
  juegos: any;
  userLoggedId: any;

  constructor(){
    const loggedIndicator = localStorage.getItem('whentheuserislogged');

    if(loggedIndicator) {
      const parsedData = JSON.parse(loggedIndicator);
      const id = parsedData.responses.id;
      this.usuarios$.loginSendData(id).subscribe((res) =>{
        this.userLoggedId = id;
      })
    }
  }


  ngOnInit(): void {

    this.getReviews();

      this._toggleSerive.currentState.subscribe(state => {
      this.verPreview = state;
    });
  }


  getReviews(): void {
    this.reviews$.getAllReviews().subscribe(
      data => {
        this.reviews = data;
        this.reviews.forEach(res => {
          this.juegos$.obtenerJuegoPorId(res.id_juego).subscribe(
            (juegoData) => {
              res.imagen = juegoData.imagen;
              res.videp = juegoData.video;
            }
          )

        })
      },
      error => {
        console.error('Error fetching reviews:', error);
      }
    );
  }



  playVideo(event: MouseEvent): void {
    if(this.verPreview == true) {
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
