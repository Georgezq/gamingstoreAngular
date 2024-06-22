import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JuegosService } from '../../../services/games/juegos.service';
import { Informacion } from '../../../interfaces/informacionInterface';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { Juegos } from '../../../interfaces/juegosInterface';

@Component({
  selector: 'app-adminjuegos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './adminjuegos.component.html',
  styleUrl: './adminjuegos.component.css'
})
export class AdminjuegosComponent {

  juegoForm: FormGroup;

  constructor(private fb: FormBuilder, private juegosService: JuegosService) {}

  ngOnInit(): void {
    this.juegoForm = this.fb.group({
      juegoId: [''],
      acercade: [''],
      desarrollador: [''],
      distribuidor: [''],
      fechaLanzamiento: [''],
      genero: [''],
      minimaOS: [''],
      minimaProcessor: [''],
      minimaMemory: [''],
      minimaGraphics: [''],
      minimaStorage: [''],
      recomendadaOS: [''],
      recomendadaProcessor: [''],
      recomendadaMemory: [''],
      recomendadaGraphics: [''],
      recomendadaStorage: [''],
      imagen: [''],
      nombre: [''],
      precio: [''],
      video: [''],
      portada: ['']
    });
  }

  agregarInformacion(): void {
    const nuevaInformacion: Informacion = {
      id: '',  // Firestore asignará el ID
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

    this.juegosService.agregarInformacion(nuevaInformacion)
      .then((docRef: DocumentReference<DocumentData>) => {
        console.log('Información agregada con éxito, ID del documento: ', docRef.id);
        this.juegoForm.reset();  // Resetear el formulario

      })
      .catch(error => {
        console.error('Error al agregar la información: ', error);
      });
  }

  agregarJuego(): void {
    const nuevoJuego: Juegos = {
      id: '',  // Firestore asignará el ID automáticamente
      imagen: this.juegoForm.value.imagen,
      nombre: this.juegoForm.value.nombre,
      precio: this.juegoForm.value.precio,
      video: this.juegoForm.value.video,
      portada: this.juegoForm.value.portada
    };

    this.juegosService.agregarJuego(nuevoJuego)
      .then((docRef: DocumentReference<DocumentData>) => {
        this.juegoForm.reset();  // Resetear el formulario
      })
      .catch(error => {
        console.error('Error al agregar el juego: ', error);
      });
  }

}
