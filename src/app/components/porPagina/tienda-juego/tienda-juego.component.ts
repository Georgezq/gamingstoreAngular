import { Component, inject } from '@angular/core';
import { JuegosService } from '../../../services/games/juegos.service';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { Juegos } from '../../../interfaces/juegosInterface';
import { ActivatedRoute } from '@angular/router';
import { Informacion } from '../../../interfaces/informacionInterface';
import { NotImageDirective } from '../../../directivas/not-image.directive';
import { TooltipModule } from 'primeng/tooltip';
import { ReviewsComponent } from '../../Generales/juegos-pages/reviews/reviews.component';
import { ButtonModule } from 'primeng/button';
import { DeseadosService } from '../../../services/wishlist-admin/deseados.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-tienda-juego',
  standalone: true,
  imports: [AsyncPipe, NgStyle, NotImageDirective, TooltipModule, ReviewsComponent, ButtonModule],
  templateUrl: './tienda-juego.component.html',
  styleUrl: './tienda-juego.component.css'
})
export class TiendaJuegoComponent {
  juegoId: string;
  userId: string;
  inWishlist: boolean;

  juego$: Observable<Juegos | null> = null;
  wishlist$ = inject(DeseadosService);
  auth$ = inject(AuthService);


  juego: any;
  informacion: any;


  constructor(private route: ActivatedRoute, private juegosService: JuegosService) {}

  //Funciones que inician al cargar la pagina
  getIdUser(){
    const storedData = localStorage.getItem('whentheuserislogged');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.userId = parsedData.responses.id;
      this.auth$.loginSendData(this.userId).subscribe((res) =>{

      })
    }
  }

  getIdGame(){
    this.juegoId = this.route.snapshot.paramMap.get('id');

    this.juegosService.obtenerJuegoPorId(this.juegoId).subscribe((response) => {
      this.juego = response;
    });

    this.juegosService.obtenerInformacionPorJuegoId(this.juegoId).subscribe((response) => {
      this.informacion = response;
    });
  }

  //Obtiene un booleano, segun el usuario logueado si tiene este juego marcado como fav

  checkIfInWishlist(): void {
    this.wishlist$.isGameInWishlist(this.userId, this.juegoId).subscribe(response => {
      this.inWishlist = response.inWishlist;
    });
  }

  //Funciones para los botones de añadir y quitar favoritos

  addToWishlist(): void {
    this.wishlist$.addToWishlist(this.userId, this.juegoId).subscribe(response => {
     // console.log('Juego añadido a la lista de deseados:', response);
      this.inWishlist = true; // Actualiza el estado
    }, error => {
      console.error('Error al añadir el juego a la lista de deseados:', error);
    });
  }

  removeFromWishlist(): void {
    this.wishlist$.removeFromWishlist(this.userId, this.juegoId).subscribe(response => {
    //  console.log('Juego eliminado de la lista de deseados:', response);
      this.inWishlist = false; // Actualiza el estado
    }, error => {
      console.error('Error al eliminar el juego de la lista de deseados:', error);
    });
  }

  

  ngOnInit(): void {

    window.scrollTo(0,0)
    this.getIdGame();
    this.getIdUser();
    this.checkIfInWishlist();

  }

}
