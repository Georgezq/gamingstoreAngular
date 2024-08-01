export interface Noticias {
  id_noticias?: string;
  titulo: string;
  imagen: string;
  contenido: string;
  subtitulo: string;
  contenido2: string;
  autor: string;
  Etiquetas: [],
  fuente: string;
  nombre_pagina?: string,
  fecha_creacion: Date;
}
