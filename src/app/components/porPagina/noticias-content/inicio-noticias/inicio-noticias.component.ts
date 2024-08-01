import { Component, inject, OnInit } from '@angular/core';
import { NoticiasService } from '../../../../services/dynamo/noticias/noticias.service';
import { JuegosService } from '../../../../services/firebase/games/juegos.service';
import { Noticias } from '../../../../interfaces/noticiasInterface';
import { Router } from '@angular/router';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';

@Component({
  selector: 'app-inicio-noticias',
  standalone: true,
  imports: [TruncatePipe],
  templateUrl: './inicio-noticias.component.html',
  styleUrl: './inicio-noticias.component.css'
})
export class InicioNoticiasComponent implements OnInit{

  noticias$ = inject(NoticiasService);
  juegos$ = inject(JuegosService);
  router = inject(Router);

  noticias: Noticias[] = [];
  allNews: Noticias[] = [];

  ngOnInit() {
    this.obtenerNoticiasPorFecha();
    this.obtenerNoticias();
  }

  formatTitulo(titulo: string): string {
    return titulo.replace(/ /g, '-');
  }

  goToNoticia(titulo: string, id: string): void {
    this.router.navigate(['newsGaming/noticia', this.formatTitulo(titulo)], { queryParams: { noticias: id } });
  }

  obtenerNoticias(){
    this.noticias$.getNoticias().subscribe(
      (res) => {
        if (res.success) {
          this.allNews = res.data;
          console.log(this.allNews)
        } else {
          console.error('Error al obtener las noticias');
        }
      },
      (error) => {
        console.error('Error en la petición:', error);
      }
    );
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

}
