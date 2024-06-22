export interface Deseados extends DeseadosForm{
  id?: string;
}

export interface DeseadosForm {
  id_usuario: string;
  id_juego: string;
  created_at?: Date;
  updates_at?: Date;
}
