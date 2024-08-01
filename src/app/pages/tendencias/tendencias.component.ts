import { Component, inject, OnInit } from '@angular/core';
import { GameslistComponent } from '../../components/porPagina/Juegos/gameslist/gameslist.component';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Juegos } from '../../interfaces/juegosInterface';
import { JuegosService } from '../../services/firebase/games/juegos.service';
import { ToggleServiceService } from '../../services/toggle-service.service';
import { AsyncPipe, NgFor, NgIf, NgStyle, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tendencias',
  standalone: true,
  imports: [AsyncPipe, NgStyle, RouterLink, SlicePipe, NgFor, ReactiveFormsModule, NgIf],
  templateUrl: './tendencias.component.html',
  styleUrl: './tendencias.component.css'
})
export class TendenciasComponent implements OnInit {

  verPreview: boolean = true;

  private _gamesService = inject(JuegosService);
  private _toggleSerive = inject(ToggleServiceService);
  private fb = inject(FormBuilder);

  filteredGames$: Observable<Juegos[]>;
  filterForm: FormGroup;
  games$: Observable<Juegos[]>;

  constructor(){
    this.filterForm = this.fb.group({
      minPrice: [''],
      maxPrice: [''],
      nombreJuego: ['']
    });
  }

  ngOnInit(): void {

    this.games$ = this._gamesService.obtenerJuegos();

    this._toggleSerive.currentState.subscribe(state => {
      this.verPreview = state;
    });


    this.filteredGames$ = combineLatest([
      this.games$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([games, filters]) => this.applyFilters(games, filters))
    );
  }

  private applyFilters(games: Juegos[], filters: any): Juegos[] {
    return games.filter(game => this.filterGame(game, filters));
  }

  private filterGame(game: Juegos, filters: any): boolean {
    const matchesPrice = (!filters.minPrice || game.precio >= filters.minPrice) &&
                         (!filters.maxPrice || game.precio <= filters.maxPrice);
    const matchesName = !filters.nombreJuego || game.nombre.toLowerCase().includes(filters.nombreJuego.toLowerCase());

    return matchesPrice && matchesName;
  }

  trackByGameId(index: number, game: Juegos): number {
    return game.id;
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




}
