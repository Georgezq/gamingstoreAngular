import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JuegosService } from '../../../services/firebase/games/juegos.service';
import { Informacion } from '../../../interfaces/informacionInterface';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { Juegos } from '../../../interfaces/juegosInterface';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-adminjuegos',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './adminjuegos.component.html',
  styleUrl: './adminjuegos.component.css'
})
export class AdminjuegosComponent {

  juegoForm: FormGroup;

  constructor(private fb: FormBuilder, private juegosService: JuegosService) {}

  ngOnInit(): void {
    this.juegoForm = this.fb.group({
      juegoId: [''],
      acercade: ['', Validators.required],
      desarrollador: ['', Validators.required],
      distribuidor: ['', Validators.required],
      fechaLanzamiento: ['', Validators.required],
      genero: ['', Validators.required],
      minimaOS: ['', Validators.required],
      minimaProcessor: ['', Validators.required],
      minimaMemory: ['', Validators.required],
      minimaGraphics: ['', Validators.required],
      minimaStorage: ['', Validators.required],
      recomendadaOS: ['', Validators.required],
      recomendadaProcessor: ['', Validators.required],
      recomendadaMemory: ['', Validators.required],
      recomendadaGraphics: ['', Validators.required],
      recomendadaStorage: ['', Validators.required],
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
