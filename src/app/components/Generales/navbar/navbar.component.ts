import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/firebase/auth/auth.service';
import { DefaultProfileImageDirective } from '../../../directivas/default-profile-image.directive';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarritoService } from '../../../services/mongodb/compras-admin/carrito.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToggleServiceService } from '../../../services/toggle-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, DefaultProfileImageDirective, HttpClientModule, RouterLinkActive, MatSlideToggleModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [HttpClient, AuthService]
})
export class NavbarComponent implements OnInit {

  auth$ = inject(AuthService);
  router = inject(Router);
  carrito$ = inject(CarritoService);
  toggle$ = inject(ToggleServiceService);

  isMenuOpen = false;
  isLogged = true;
  photoUrl: string;
  usuarioId: string;
  juegosCarritoCount: number;

  mouseEnter() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private isAuthenticated(){
    this.auth$.isAuthenticated.subscribe((isAuthenticated) => { });
  }

  mouseLeave(){
    this.isMenuOpen = this.isMenuOpen = false;
  }

  async signOut(){
    this.auth$.signOutSession();
    Swal.fire({
      title: 'Haz cerrado tu sesión',
      icon: 'warning',
      timer: 2000,
      timerProgressBar: true,
    }).then(
      async () => {
        this.router.navigate(['/']);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    )

  }

  onToggleChange(event: any) {
    this.toggle$.changeState(event.checked);
  }

  obtenerConteo() {
    const loggedIndicator = localStorage.getItem('whentheuserislogged');

    try {
      const parsedData = JSON.parse(loggedIndicator);
      const id = parsedData.responses.id;
      this.carrito$.obtenerCountByUser(id).subscribe(
        (response) => {
            this.juegosCarritoCount = response.carritoCount;
        },
        (error) => {
          this.juegosCarritoCount = 0;
        }
      );
    } catch (error) {
      this.juegosCarritoCount = 0;  // Si ocurre algún error, establecer el conteo a 0 para mostrar que no hay artículos en el carrito.
    }
  }



  ngOnInit(): void {

    this.isAuthenticated();

    const loggedIndicator = localStorage.getItem('whentheuserislogged');

    if(loggedIndicator) {
      this.isLogged = true;
      const parsedData = JSON.parse(loggedIndicator);
      const id = parsedData.responses.id;
      this.auth$.loginSendData(id).subscribe((res) =>{
        this.photoUrl = res.imagenperfil;
        this.usuarioId = id;
      })
    } else{
      this.isLogged = false;
    }

    this.obtenerConteo();

  }

}
