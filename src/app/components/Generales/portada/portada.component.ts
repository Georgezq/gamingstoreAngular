import { Component, inject, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ImageninicioService } from '../../../services/firebase/portada/imageninicio.service';
import { Portada } from '../../../interfaces/portadaInicioInterface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [DividerModule, CurrencyPipe],
  templateUrl: './portada.component.html',
  styleUrl: './portada.component.css'
})
export class PortadaComponent implements OnInit{

  portada$ = inject(ImageninicioService);
  portada: Portada[] = [];
  imagen: any;
  nombre: any;
  precio: any;

  constructor(){

  }

  obtenerPortada(){
    this.portada$.obtenerPortada().subscribe(
      (res:any) => {
        this.portada = res;

        this.portada.forEach(
          (data:any) =>{
            this.imagen = data.imagen;
            this.nombre = data.nombre;
            this.precio = data.precio;
          }
        )
      }
    )
  }

  ngOnInit(): void {
    this.obtenerPortada();
  }

}
