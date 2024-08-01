export interface Categorias extends CategoriasForm{
  id?: string;
}

export interface CategoriasForm {
  nombre_cat: string;
  imagen_bg: string;
  imagen_ref: string;
}
