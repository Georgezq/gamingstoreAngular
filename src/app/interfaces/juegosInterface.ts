export interface Juegos extends JuegosForm{
  id?: any;
}

export interface JuegosForm {
  imagen: string;
  nombre: string;
  precio: number;
  video: string;
  portada?: string;
}
