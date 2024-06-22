import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgStyle, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject} from 'rxjs';
import { JuegosService } from '../../../../services/games/juegos.service';

@Component({
  selector: 'app-gameslist',
  standalone: true,
  imports: [AsyncPipe, NgStyle, RouterLink, SlicePipe],
  templateUrl: './gameslist.component.html',
  styleUrl: './gameslist.component.css'
})
export class GameslistComponent {

  @Input() numElementos: number; // Acepta el número de elementos desde el componente padre

  juegos: any[] = [];

  private _gamesService = inject(JuegosService);

  constructor(){

  }

  games$ = this._gamesService.obtenerJuegos();

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
