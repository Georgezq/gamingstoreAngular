import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CardsinfoComponent } from '../../components/porPagina/cardsinfo/cardsinfo.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DefaultProfileImageDirective } from '../../directivas/default-profile-image.directive';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [HttpClientModule,NgClass, NgIf, RouterOutlet, RouterLink, RouterLinkActive, DefaultProfileImageDirective],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
  providers: [HttpClient, AuthService]

})
export class UserPageComponent implements OnInit{

  auth$ = inject(AuthService);

  fecha: string;
  photoUrl: string;
  displayName: string;
  usuarioId: string;
  discord: string;
  steam: string;
  youtube: string;


  ngOnInit(): void {
    const storedData = localStorage.getItem('whentheuserislogged');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const id = parsedData.responses.id;
      this.auth$.loginSendData(id).subscribe((res) =>{
        this.photoUrl = res.imagenperfil;
        this.discord = res.redesSociales.discord;
        this.steam = res.redesSociales.steam;
        this.youtube = res.redesSociales.youtube;
        this.usuarioId = id;

        const fecha = res.fechacreacion;
        const correo = res.email;
        if(parsedData.UserName == null) {
          this.displayName = correo.split('@')[0];
        } else {
          this.displayName = res.displayName;
        }

        // Crear una instancia de Date a partir de la fecha almacenada
        const fechaDate = new Date(fecha);

        // Opciones de formato para toLocaleDateString()
        const opciones: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };

        // Formatear la fecha utilizando toLocaleDateString()
        this.fecha = fechaDate.toLocaleDateString('es-ES', opciones);

      })
    }
  }

}
