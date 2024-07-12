import { Component, inject, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/dynamo/noticias/noticias.service';
import { Noticias } from '../../interfaces/noticiasInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-noticias',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './all-noticias.component.html',
  styleUrl: './all-noticias.component.css'
})
export class AllNoticiasComponent implements OnInit{

  noticias$ = inject(NoticiasService);
  routes$ = inject(ActivatedRoute);
  router$ = inject(Router)

  noticias: Noticias[] = [];
  noticiaId: any;
  noticiaTitulo: string;

  getNoticiasById(){
    this.routes$.paramMap.subscribe(params => {
      this.noticiaTitulo = params.get('titulo');

      this.routes$.queryParams.subscribe(queryParams => {
        this.noticiaId = queryParams['noticias'];
      });


    this.noticias$.getNoticiasById(this.noticiaId).subscribe(
      (noticia:any) => {
        if(noticia.success){
          this.noticias = [noticia.data];
        }
    });
  });
}


  ngOnInit(): void {
    this.getNoticiasById();
  }
}
