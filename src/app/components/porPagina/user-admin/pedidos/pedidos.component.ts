import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JuegosService } from '../../../../services/firebase/games/juegos.service';
import { CarritoService } from '../../../../services/mongodb/compras-admin/carrito.service';
import { CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CurrencyPipe, NgIf],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit{

  carrito$ = inject(CarritoService);
  route$ = inject(ActivatedRoute);
  juegos$ = inject(JuegosService);

  userId: any;

  carritotList: any[] = [];
  carritoGames: any[] = [];
  carritoGameIds: any[] = [];
  estadLista: any[] = [];
  estadoCarrito: any[] = [];


  ngOnInit(): void {
    this.getUsers();
    this.getGamesComprados();
  }

  getUsers() {
    const storedData = localStorage.getItem('whentheuserislogged');
    const parsedData = JSON.parse(storedData);
    const id = parsedData.responses.id;
    this.userId = id;
  }

  getGamesComprados(): void {
    try {
      this.carrito$.obtenerCompradosById(this.userId).subscribe(
        (response) => {
          this.carritoGameIds = response; // response debería ser un arreglo de IDs de juegos
          // Reiniciar la lista y el precio total
          this.carritotList = [];

          // Iterar sobre cada ID de juego en el carrito
          this.carritoGameIds.forEach((id) => {
            this.juegos$.obtenerJuegoPorId(id).subscribe(
              (juego) => {
                this.carritotList.push(juego); // Agregar el juego a la lista
              },
              (error) => {
                throw(error);
              }
            );
          });
        },
        (error) => {
          this.carritotList = []; // Reiniciar la lista en caso de error
          throw(error);
        }
      );
    } catch (error) {
      throw(error);
    }

  }


}
