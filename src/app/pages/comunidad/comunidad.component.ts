import { Component } from '@angular/core';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.css'
})
export class ComunidadComponent {

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
