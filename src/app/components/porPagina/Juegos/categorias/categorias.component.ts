import { Component, inject, OnInit } from '@angular/core';
import { CategoriasService } from '../../../../services/firebase/categorias/categorias.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit{


  private categoria$ = inject(CategoriasService);
  categorias = this.categoria$.obtenerCategorias();
  
  ngOnInit(): void {

  }

}
