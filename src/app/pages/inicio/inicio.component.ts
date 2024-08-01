import { AsyncPipe, NgFor, NgOptimizedImage, NgStyle } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JuegosService } from '../../services/firebase/games/juegos.service';
import { GameslistComponent } from '../../components/porPagina/Juegos/gameslist/gameslist.component';
import { PortadaComponent } from '../../components/Generales/portada/portada.component';
import { CategoriasComponent } from '../../components/porPagina/Juegos/categorias/categorias.component';
import { AuthService } from '../../services/firebase/auth/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CategoriasComponent ,NgOptimizedImage, AsyncPipe, NgFor, NgStyle, GameslistComponent, PortadaComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{

  private auth$ = inject(AuthService);

  private isAuthenticated(){
    this.auth$.isAuthenticated.subscribe((isAuthenticated) => {

    });
  }


  ngOnInit(): void {
    this.isAuthenticated();
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
