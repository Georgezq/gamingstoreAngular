import { CurrencyPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoriasService } from '../../../../../../services/firebase/categorias/categorias.service';
import { Categorias } from '../../../../../../interfaces/categoriasInterface';

@Component({
  selector: 'app-vista-categorias',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, CurrencyPipe, NgIf],
  templateUrl: './vista-categorias.component.html',
  styleUrl: './vista-categorias.component.css'
})
export class VistaCategoriasComponent implements AfterViewInit{

  private categorias$ = inject(CategoriasService);
  private fb = inject(FormBuilder);
  private categorias: Categorias[];

  displayedColumns: string[] = ['categoria', 'acciones'];
  categoriaForm: FormGroup;
  categoriaId: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(){
    this.inicializarFormulario();
  }

  ngAfterViewInit() {
    this.categorias$.obtenerCategorias().subscribe(
      (res: any) => {
        this.categorias = res;
        this.dataSource = new MatTableDataSource<Categorias>(this.categorias)
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private inicializarFormulario(){
    this.categoriaForm = this.fb.group({
      imagen_bg: ['', Validators.required],
      imagen_ref: ['', Validators.required],
      nombre_cat: ['', Validators.required],
    });
  }

  formularioDireccion:boolean = false;

  abrirFormulario(id: any){
    this.categoriaId = id;
      this.formularioDireccion = true;

      this.categorias$.obtenerJuegoPorId(this.categoriaId).subscribe(
        (res:any) => {
          this.categoriaForm.patchValue({
            imagen_bg: res.imagen_bg,
            imagen_ref: res.imagen_ref,
            nombre_cat: res.nombre_cat,
          })
        }
      )
  }

  cerrarModal() {
    this.formularioDireccion = false;
  }

  editarJuego(){
    try {
      if(this.categoriaForm.valid){
        const updateData: Categorias = {
          imagen_bg: this.categoriaForm.value.imagen_bg,
          imagen_ref: this.categoriaForm.value.imagen_ref,
          nombre_cat: this.categoriaForm.value.nombre_cat,
        };
        this.categorias$.editarCategoria(this.categoriaId, updateData);
        this.cerrarModal();
      }
    } catch (error) {
      throw(error);
    }
  }

  eliminarJuego(id: any){
    try {
      this.categorias$.eliminarCategoria(id);
    } catch (error) {
      throw(error);
    }
  }

}
