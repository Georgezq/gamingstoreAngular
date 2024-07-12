import { Component, inject, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/dynamo/noticias/noticias.service';
import { Noticias } from '../../interfaces/noticiasInterface';
import { Router, RouterLink } from '@angular/router';
import { JuegosService } from '../../services/firebase/games/juegos.service';
import { Juegos } from '../../interfaces/juegosInterface';
import { CurrencyPipe } from '@angular/common';
import { id } from 'date-fns/locale';
import { Informacion } from '../../interfaces/informacionInterface';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent implements OnInit {

  noticias$ = inject(NoticiasService);
  juegos$ = inject(JuegosService);
  router = inject(Router);

  juegos: any;
  informacion: any;
  fechaLanzamiento: any;
  noticias: Noticias[] = [];
  juegoId: any;

  constructor(){}

  ngOnInit() {
    this.obtenerNoticiasPorFecha();
    this.obtenerJuegos();
  }

  obtenerJuegos(){
    this.juegos$.obtenerJuegos().subscribe(
      (res: any) => {
        this.juegos = res.slice(0, 4);
        if (res) {
          this.juegos.forEach((juego: any) => {
            this.obtenerFecha(juego.id).subscribe((response: any) => {
              juego.fechaLanzamiento = response.fechaLanzamiento;
            });
          });
        }
      }
    );
  }

  obtenerFecha(id: any){
    return this.juegos$.obtenerInformacionPorJuegoId(id);
  }




  obtenerNoticiasPorFecha(){
    this.noticias$.getNoticias().subscribe(
      (res) => {
        if (res.success) {
          // Ordenar las noticias por fecha de creación en orden descendente
          this.noticias = res.data.sort((a: any, b: any) => {
            return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
          }).slice(0, 2); // Limitar a las primeras 2 noticias
        } else {
          console.error('Error al obtener las noticias');
        }
      },
      (error) => {
        console.error('Error en la petición:', error);
      }
    );
  }

  formatTitulo(titulo: string): string {
    return titulo.replace(/ /g, '-');
  }

  goToNoticia(titulo: string, id: string): void {
    this.router.navigate(['/noticia', this.formatTitulo(titulo)], { queryParams: { noticias: id } });
  }




}
