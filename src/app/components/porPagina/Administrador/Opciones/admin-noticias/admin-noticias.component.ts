import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../../../../services/firebase/auth/auth.service';
import { NoticiasService } from '../../../../../services/dynamo/noticias/noticias.service';
import { Noticias } from '../../../../../interfaces/noticiasInterface';

@Component({
  selector: 'app-admin-noticias',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor,NgIf, DividerModule],
  templateUrl: './admin-noticias.component.html',
  styleUrl: './admin-noticias.component.css'
})
export class AdminNoticiasComponent implements OnInit{

  private fb = inject(FormBuilder);
  private auth$ = inject(AuthService);
  private noticias$ = inject(NoticiasService);

  todayDate: any;
  displayName: any;

  noticiaForm: FormGroup;
  subtituloIf: boolean = false ;

  constructor(){
    this.inicializarNoticiaForm();
    this.setTodayDate();
    this.obtenerNombreAutor();
  }

  obtenerNombreAutor(){
    const storedData = localStorage.getItem('whentheuserislogged');
    const parsedData = JSON.parse(storedData);
    const id = parsedData.responses.id;

    this.auth$.loginSendData(id).subscribe(
      (res) => {
        const correo = res.email;
        if(parsedData.UserName == null) {
          this.displayName = correo.split('@')[0];
        } else {
          this.displayName = res.displayName;
        }
      }
    )
  }

  setTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = today.getFullYear();
    this.todayDate = `${day}/${month}/${year}`;
  }

  inicializarNoticiaForm(){
    this.noticiaForm = this.fb.group({
      autor: ['', ], //Obtenido
      fehca_creacion: [''], //Obtenida
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      imagen: [''],
      subtitulo: [''],
      contenido_sub: [''],
      fuente: ['',Validators.required],
      pagina_fuente: ['', Validators.required],
      etiquetas: this.fb.array([]),
    });
  }

  sendNews(){
    try {
      if(this.noticiaForm.valid){
        const nuevaNoticia: Noticias = {
          autor: this.displayName,
          fecha_creacion: this.todayDate,
          titulo: this.noticiaForm.value.titulo,
          contenido: this.noticiaForm.value.contenido,
          imagen: this.noticiaForm.value.imagen,
          subtitulo: this.noticiaForm.value.subtitulo,
          contenido2: this.noticiaForm.value.contenido_sub,
          fuente: this.noticiaForm.value.fuente,
          nombre_pagina: this.noticiaForm.value.pagina_fuente,
          Etiquetas: this.noticiaForm.value.etiquetas,
        };
        this.noticias$.sendNews(nuevaNoticia).subscribe(
          (res)=>{
            console.log(res);
            this.noticiaForm.reset();
          }
        );
      }
    } catch (error) {
      throw(error);
    }
  }


  get etiquetas(): FormArray {
    return this.noticiaForm.get('etiquetas') as FormArray;
  }

  aparecerOpcionesSub(){
    if(this.subtituloIf == false) {
      this.subtituloIf = true;
    } else {
      this.subtituloIf = false;
    }
  }

  addEtiqueta() {
    this.etiquetas.push(this.fb.control(''));
  }

  removeEtiqueta(index: number) {
    this.etiquetas.removeAt(index);
  }

  ngOnInit(): void {

  }

}
