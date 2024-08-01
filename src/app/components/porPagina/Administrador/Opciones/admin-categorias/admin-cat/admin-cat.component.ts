import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasService } from '../../../../../../services/firebase/categorias/categorias.service';
import { Categorias, CategoriasForm } from '../../../../../../interfaces/categoriasInterface';

@Component({
  selector: 'app-admin-cat',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './admin-cat.component.html',
  styleUrl: './admin-cat.component.css'
})
export class AdminCatComponent {

  private fb = inject(FormBuilder);
  private categorias$ = inject(CategoriasService);

  categoriaForm: FormGroup;
  juegosId: any;

  constructor(){
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.categoriaForm = this.fb.group({
      imagen_bg: ['', Validators.required],
      imagen_ref: ['', Validators.required],
      nombre_cat: ['', Validators.required],
    });
  }

  agregarCategoria(){
    try {
      if(this.categoriaForm.valid){
        const nuevaCategoria: Categorias = {
          nombre_cat: this.categoriaForm.value.nombre_cat,
          imagen_ref: this.categoriaForm.value.imagen_ref,
          imagen_bg: this.categoriaForm.value.imagen_bg,
        };
        this.categorias$.agregarCategoria(nuevaCategoria);
      }
    } catch (error) {
      throw(error);
    }
  }
}
