export interface Informacion extends InformacionForm{
  id?: string;
}

export interface Especificaciones {
  sistema: string;
  procesador: string;
  memoria: string;
  graficos: string;
  almacenamiento: string;
}

export interface InformacionForm {
  juegoId: string;
  acercade: string;
  desarrollador: string;
  distribuidor: number;
  fechaLanzamiento: string;
  video: string;
  genero: [];
  configuracion: {
    minima: Especificaciones;
    recomendada: Especificaciones;
  };

}
