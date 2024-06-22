import { Component } from '@angular/core';
import { GameslistComponent } from '../../components/Generales/juegos-pages/gameslist/gameslist.component';

@Component({
  selector: 'app-tendencias',
  standalone: true,
  imports: [GameslistComponent],
  templateUrl: './tendencias.component.html',
  styleUrl: './tendencias.component.css'
})
export class TendenciasComponent {



}
