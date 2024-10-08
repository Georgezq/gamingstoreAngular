import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgStyle, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JuegosService } from '../../../../services/firebase/games/juegos.service';
import { ToggleServiceService } from '../../../../services/toggle-service.service';

@Component({
  selector: 'app-gameslist',
  standalone: true,
  imports: [AsyncPipe, NgStyle, RouterLink, SlicePipe],
  templateUrl: './gameslist.component.html',
  styleUrl: './gameslist.component.css'
})
export class GameslistComponent implements OnInit {

  @Input() numElementos: number; // Acepta el número de elementos desde el componente padre
  verPreview: boolean = true;



  private _gamesService = inject(JuegosService);
  private _toggleSerive = inject(ToggleServiceService);

  constructor(){

  }
  ngOnInit(): void {
    this._toggleSerive.currentState.subscribe(state => {
      this.verPreview = state;
    });
  }

  games$ = this._gamesService.obtenerJuegos();

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
