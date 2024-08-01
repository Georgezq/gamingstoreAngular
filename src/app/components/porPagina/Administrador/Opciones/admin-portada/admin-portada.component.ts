import { Component, inject, OnInit } from '@angular/core';
import { ImageninicioService } from '../../../../../services/firebase/portada/imageninicio.service';
import { Portada } from '../../../../../interfaces/portadaInicioInterface';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-portada',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './admin-portada.component.html',
  styleUrl: './admin-portada.component.css'
})
export class AdminPortadaComponent implements OnInit{

  portada$ = inject(ImageninicioService);
  private fb = inject(FormBuilder);

  portada: Portada[];
  portadForm: FormGroup;

  id: any;
  imagen: any;
  nombre: any;
  precio: any;

  private getId(){
    this.portada$.obtenerPortadaId().subscribe(
      (res)=>{
        this.id = res[0];
      }
    )
  }

  async obtenerPortada(){
    await this.portada$.obtenerPortada().subscribe(
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

  private inicializarFormulario(): void {
    this.portadForm = this.fb.group({
      nombre: ['', Validators.required],
      imagen: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }


  onSubmit(){
    const portadaData: Portada = {
      nombre: this.portadForm.value.nombre,
      imagen: this.portadForm.value.imagen,
      precio: this.portadForm.value.precio,
    };

    this.portada$.editarPortada(this.id, portadaData);
    this.portadForm.reset();

  }

  ngOnInit(): void {
    this.obtenerPortada();
    this.getId();
    this.inicializarFormulario();
  }

}
