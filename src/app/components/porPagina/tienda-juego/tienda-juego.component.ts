import { Component, inject } from '@angular/core';
import { JuegosService } from '../../../services/firebase/games/juegos.service';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Observable } from 'rxjs';
import { Juegos } from '../../../interfaces/juegosInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { NotImageDirective } from '../../../directivas/not-image.directive';
import { TooltipModule } from 'primeng/tooltip';
import { ReviewsComponent } from '../../Generales/juegos-pages/reviews/reviews.component';
import { ButtonModule } from 'primeng/button';
import { DeseadosService } from '../../../services/mongodb/wishlist-admin/deseados.service';
import { AuthService } from '../../../services/firebase/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { CarritoService } from '../../../services/mongodb/compras-admin/carrito.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {  ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-tienda-juego',
  standalone: true,
  imports: [AsyncPipe, NgStyle, NotImageDirective, TooltipModule, ReviewsComponent, ButtonModule, ToastModule, ConfirmDialogModule],
  templateUrl: './tienda-juego.component.html',
  styleUrl: './tienda-juego.component.css',
  providers: [MessageService, ConfirmationService],
})
export class TiendaJuegoComponent {
  juegoId: string;
  userId: string;
  inWishlist: boolean;
  gameName: any;
  ref: DynamicDialogRef | undefined;

  juego$: Observable<Juegos | null> = null;

  wishlist$ = inject(DeseadosService);
  auth$ = inject(AuthService);
  title$ = inject(Title);
  route$ = inject(ActivatedRoute);
  routeN = inject(Router);
  carrito$ = inject(CarritoService);


  juego: any;
  informacion: any;


  constructor(private route: ActivatedRoute, private juegosService: JuegosService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

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
      this.gameName = response.nombre;
      this.title$.setTitle(`Comprar ${this.gameName}`)

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
      try {
        if(this.userId != undefined){
          this.wishlist$.addToWishlist(this.userId, this.juegoId).subscribe(response => {
            this.inWishlist = true; // Actualiza el estado
            this.messageService.add({ severity: 'info', summary: 'Listo!', detail: 'Juego añadido a tu lista de deseos' });
      
          });
        } else {
          this.routeN.navigate(['login']);
        }
      } catch (error) {
        error => {
          console.error('Error al añadir el juego a la lista de deseos:', error);
        }
      }
    
    
  }
  removeFromWishlist(): void {
    this.wishlist$.removeFromWishlist(this.userId, this.juegoId).subscribe(response => {
    //  console.log('Juego eliminado de la lista de deseados:', response);
      this.inWishlist = false; // Actualiza el estado
      this.messageService.add({ severity: 'error', summary: 'Eliminado!', detail: 'Juego eliminado de tu lista de deseos' });

    }, error => {
      console.error('Error al eliminar el juego de la lista de deseados:', error);
    });
  }

  //Para añadir al carrito
   addToCart(): void {
    try {
      if(this.userId != undefined){
        this.carrito$.agregarAlCarrito(this.userId, this.juegoId, true).subscribe(
          (response: any) => {
            console.log('Juego añadido al carrito:', response);
          }
        );
      }  else {
        this.routeN.navigate(['login']);
      }
      
    } catch (error) {
      error => {
        console.error('Error al añadir el juego al carrito:', error);
      }
    }
  }



  ngOnInit(): void {

    window.scrollTo(0,0)
    this.getIdGame();
    this.getIdUser();
    this.checkIfInWishlist();

  }

}
