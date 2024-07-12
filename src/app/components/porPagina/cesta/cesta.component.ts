import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../../services/mongodb/compras-admin/carrito.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JuegosService } from '../../../services/firebase/games/juegos.service';
import { CurrencyPipe } from '@angular/common';
import { CheckoutService } from '../../../services/stripe/pagos/checkout.service';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, StepsModule],
  templateUrl: './cesta.component.html',
  styleUrl: './cesta.component.css'
})
export class CestaComponent implements OnInit{
  items: MenuItem[] | undefined;

  carrito$ = inject(CarritoService);
  route$ = inject(ActivatedRoute);
  juegos$ = inject(JuegosService);
  checkout$ = inject(CheckoutService);

  carritotList: any[] = [];
  carritoGames: any[] = [];
  carritoGameIds: any[] = [];
  estadLista: any[] = [];
  estadoCarrito: any[] = [];

  userId: any;
  totalPrice: number = 0;
  noGames: boolean = false;


  ngOnInit(): void {
    this.getUsers();
    this.getCarritoState();
    this.newItems();
  }

  newItems(){
    this.items = [
      {
          label: 'Personal',
          routerLink: 'carrito'
      },
      {
          label: 'Seat',
          routerLink: 'seat'
      },
      {
          label: 'Payment',
          routerLink: 'payment'
      }
  ];
  }

  getUsers() {
    const storedData = localStorage.getItem('whentheuserislogged');
    const parsedData = JSON.parse(storedData);
    const id = parsedData.responses.id;
    this.userId = id;
  }

  onProceedToPay(): void {
    this.checkout$.onProceedToPay(this.carritotList, this.userId);
  }

  getCarritoState(): void {
    this.carrito$.obtenerCarritoEstado(this.userId).subscribe(
      (response) => {
        this.estadoCarrito = response;
        this.getGamesInMyCart(); // Llamar a getGamesInMyCart después de obtener el estado del carrito
      },
      (error) => {
        console.error('Error al obtener los estados del carrito:', error);
      }
    );
  }

  getGamesInMyCart(): void {
    this.carrito$.obtenerCarrito(this.userId).subscribe(
      (response) => {
        this.carritoGameIds = response; // response debería ser un arreglo de IDs de juegos

        // Reiniciar la lista y el precio total
        this.carritotList = [];
        this.totalPrice = 0;

        // Iterar sobre cada ID de juego en el carrito
        this.carritoGameIds.forEach((id) => {
          this.juegos$.obtenerJuegoPorId(id).subscribe(
            (juego) => {
              this.carritotList.push(juego); // Agregar el juego a la lista
              this.totalPrice += juego.precio; // Sumar el precio del juego al total
            },
            (error) => {
              console.error('Error al obtener la información del juego:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener el carrito:', error);
        this.carritotList = []; // Reiniciar la lista en caso de error
        this.totalPrice = 0;
      }
    );
  }

  removeItem(idGame: string) {
    this.carrito$.eliminarDelCarrito(this.userId, idGame).subscribe(
      () => {
        // Refrescar la lista de juegos en el carrito
        this.getGamesInMyCart();
      },
      (error) => {
        console.error('Error al eliminar el juego del carrito:', error);
      }
    );
  }
}
