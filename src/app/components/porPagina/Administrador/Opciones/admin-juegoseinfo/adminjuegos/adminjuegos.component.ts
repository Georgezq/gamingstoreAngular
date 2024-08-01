import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { NgIf } from '@angular/common';
import { Informacion } from '../../../../../../interfaces/informacionInterface';
import { Juegos } from '../../../../../../interfaces/juegosInterface';
import { JuegosService } from '../../../../../../services/firebase/games/juegos.service';

@Component({
  selector: 'app-adminjuegos',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './adminjuegos.component.html',
  styleUrl: './adminjuegos.component.css'
})
export class AdminjuegosComponent {


  juegoForm: FormGroup;
  juegosId: any;

  constructor(private fb: FormBuilder, private juegosService: JuegosService) {}

  obtenerIds(){
    this.juegosService.obtenerJuegos().subscribe(
      (res: any) => {
        this.juegosId = res;
      }
    )
  }

  ngOnInit(): void {

    this.obtenerIds();

    this.juegoForm = this.fb.group({
      juegoId: [''],
      acercade: [''],
      desarrollador: ['',],
      distribuidor: ['', ],
      fechaLanzamiento: ['',],
      genero: ['', ],
      minimaOS: ['',],
      minimaProcessor: ['', ],
      minimaMemory: ['', ],
      minimaGraphics: ['',],
      minimaStorage: ['', ],
      recomendadaOS: ['', ],
      recomendadaProcessor: ['', ],
      recomendadaMemory: ['', ],
      recomendadaGraphics: ['',],
      recomendadaStorage: ['', ],
      imagen: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      video: ['', Validators.required],
      portada: ['', Validators.required]
    });
  }

  agregarInformacion(): void {
    const nuevaInformacion: Informacion = {
      juegoId: this.juegoForm.value.juegoId,
      acercade: this.juegoForm.value.acercade,
      desarrollador: this.juegoForm.value.desarrollador,
      distribuidor: this.juegoForm.value.distribuidor,
      fechaLanzamiento: this.juegoForm.value.fechaLanzamiento,
      video: this.juegoForm.value.video,
      genero: this.juegoForm.value.genero.split(','), // Assuming it's a comma-separated string
      configuracion: {
        minima: {
          sistema: this.juegoForm.value.minimaOS,
          procesador: this.juegoForm.value.minimaProcessor,
          memoria: this.juegoForm.value.minimaMemory,
          graficos: this.juegoForm.value.minimaGraphics,
          almacenamiento: this.juegoForm.value.minimaStorage
        },
        recomendada: {
          sistema: this.juegoForm.value.recomendadaOS,
          procesador: this.juegoForm.value.recomendadaProcessor,
          memoria: this.juegoForm.value.recomendadaMemory,
          graficos: this.juegoForm.value.recomendadaGraphics,
          almacenamiento: this.juegoForm.value.recomendadaStorage
        }
      }
    };

    if(this.juegoForm.valid) {

      this.juegosService.agregarInformacion(nuevaInformacion)
        .then((docRef: DocumentReference<DocumentData>) => {
          console.log('Información agregada con éxito, ID del documento: ', docRef.id);
          this.juegoForm.reset();  // Resetear el formulario

        })
        .catch(error => {
          console.error('Error al agregar la información: ', error);
        });
    } else {
      console.log('El formulario no esta completo')
    }

  }

  agregarJuego(): void {
    const nuevoJuego: Juegos = {
      imagen: this.juegoForm.value.imagen,
      nombre: this.juegoForm.value.nombre,
      precio: this.juegoForm.value.precio,
      video: this.juegoForm.value.video,
      portada: this.juegoForm.value.portada
    };

    if(this.juegoForm.valid) {
      this.juegosService.agregarJuego(nuevoJuego)
      .then((docRef: DocumentReference<DocumentData>) => {
        this.juegoForm.reset();  // Resetear el formulario
      })
      .catch(error => {
        console.error('Error al agregar el juego: ', error);
      });
    } else {
      console.log('El formulario no esta completo')
    }


  }

}
