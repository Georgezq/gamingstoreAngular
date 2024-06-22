export interface Reviews extends ReviewsForm{
  id?: string;
}

export interface ReviewsForm {
  id_usuario: string;
  id_juego: string;
  comentario: string;
  calificacion: boolean;
  fecha?: Date;
  pros: string[];
  contras: string[];
  likes: 0;
  dislikes: 0;
}
