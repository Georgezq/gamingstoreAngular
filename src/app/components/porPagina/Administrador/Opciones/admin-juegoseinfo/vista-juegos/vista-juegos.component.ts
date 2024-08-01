import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { JuegosService } from '../../../../../../services/firebase/games/juegos.service';
import { Juegos } from '../../../../../../interfaces/juegosInterface';
import { CurrencyPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-vista-juegos',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, CurrencyPipe, NgIf],
  templateUrl: './vista-juegos.component.html',
  styleUrl: './vista-juegos.component.css'
})
export class VistaJuegosComponent implements AfterViewInit{

  private juegos$ = inject(JuegosService);
  private fb = inject(FormBuilder);
  private juegos: Juegos[];

  displayedColumns: string[] = ['juego', 'precio', 'acciones'];
  juegoForm: FormGroup;
  juegosId: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(){
    this.inicializarFormulario();
  }

  ngAfterViewInit() {
    this.juegos$.obtenerJuegos().subscribe(
      (res: any) => {
        this.juegos = res;
        this.dataSource = new MatTableDataSource<Juegos>(this.juegos)
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private inicializarFormulario(){
    this.juegoForm = this.fb.group({
      imagen: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      video: ['', Validators.required],
    });
  }

  formularioDireccion:boolean = false;

  abrirFormulario(id: any){
    this.juegosId = id;
      this.formularioDireccion = true;

      this.juegos$.obtenerJuegoPorId(this.juegosId).subscribe(
        (res:any) => {
          this.juegoForm.patchValue({
            imagen: res.imagen,
            nombre: res.nombre,
            video: res.video,
            precio: res.precio,
          })
        }
      )
  }

  cerrarModal() {
    this.formularioDireccion = false;
  }

  editarJuego(){
    try {
      if(this.juegoForm.valid){
        const updateData: Juegos = {
          nombre: this.juegoForm.value.nombre,
          precio: this.juegoForm.value.precio,
          imagen: this.juegoForm.value.imagen,
          video: this.juegoForm.value.video,
        };
        this.juegos$.editarJuego(this.juegosId, updateData);
        this.cerrarModal();
      }
    } catch (error) {
      throw(error);
    }
  }

  eliminarJuego(id: any){
    try {
      this.juegos$.eliminarDestino(id);
    } catch (error) {
      throw(error);
    }
  }


}
