import { Component, inject, OnInit } from '@angular/core';
import { ToggleServiceService } from '../../services/toggle-service.service';
import { ViewallReviewsComponent } from '../../components/Generales/viewall-reviews/viewall-reviews.component';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [ViewallReviewsComponent],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.css'
})
export class ComunidadComponent implements OnInit{

  _toggleSerive = inject(ToggleServiceService);
  verPreview: boolean = true;

  ngOnInit(): void {
      this._toggleSerive.currentState.subscribe(state => {
      this.verPreview = state;
    });
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
