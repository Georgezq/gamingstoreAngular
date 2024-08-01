import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { CarritoService } from '../../../../services/mongodb/compras-admin/carrito.service';
import { JuegosService } from '../../../../services/firebase/games/juegos.service';
import { CheckoutService } from '../../../../services/stripe/pagos/checkout.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../../../services/conexion';

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
  private snackBar = inject(MatSnackBar); // Inyectar MatSnackBar


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
  }

  getUsers() {
    const storedData = localStorage.getItem('whentheuserislogged');
    const parsedData = JSON.parse(storedData);
    const id = parsedData.responses.id;
    this.userId = id;
  }

  onProceedToPay() {
    if (this.carritotList.length === 0) {
      this.snackBar.open('No hay juegos en la cesta. Agrega juegos antes de proceder al pago.', 'Cerrar', {
        duration: 3000, // Duración de la notificación en milisegundos
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } else {
      this.checkout$.onProceedToPay(this.carritotList, this.userId);
    }
  }

  getCarritoState(): void {
    try {
      this.carrito$.obtenerCarritoEstado(this.userId).subscribe(
        (response) => {
          this.estadoCarrito = response;
          this.getGamesInMyCart(); // Llamar a getGamesInMyCart después de obtener el estado del carrito
        },
        (error) => {
          throw(error);
        }
      );
    } catch (error) {
      throw(error);

    }
  }

  getGamesInMyCart(): void {
    try {
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
                throw(error);
              }
            );
          });
        },
        (error) => {
          this.carritotList = []; // Reiniciar la lista en caso de error
          this.totalPrice = 0;
          throw(error);
        }
      );
    } catch (error) {
      throw(error);
    }

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
