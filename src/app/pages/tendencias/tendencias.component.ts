import { Component, OnInit } from '@angular/core';
import { GameslistComponent } from '../../components/Generales/juegos-pages/gameslist/gameslist.component';
import { Observable } from 'rxjs';
import { Juegos } from '../../interfaces/juegosInterface';

@Component({
  selector: 'app-tendencias',
  standalone: true,
  imports: [GameslistComponent],
  templateUrl: './tendencias.component.html',
  styleUrl: './tendencias.component.css'
})
export class TendenciasComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }




}
