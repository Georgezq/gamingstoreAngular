export interface Usuario extends UsuarioForm{
  id?: string;
}


export interface UsuarioForm {
  displayName: string,
  nombre?: string,
  correo?: string,
  imagenperfil?: string,
  fechacreacion?: Date,
  redesSociales?: {
      discord: string,
      steam: string,
      youtube: string
  },

}
