import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { DefaultProfileImageDirective } from '../../../directivas/default-profile-image.directive';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, DefaultProfileImageDirective, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [HttpClient, AuthService]
})
export class NavbarComponent implements OnInit {

  auth$ = inject(AuthService);
  router = inject(Router);

  isMenuOpen = false;
  isLogged = true;
  photoUrl: string;
  usuarioId: string;

  mouseEnter() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  mouseLeave(){
    this.isMenuOpen = this.isMenuOpen = false;
  }

  signOut(){
    this.auth$.signOutSession();
    window.location.reload();
  }

  ngOnInit(): void {
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
  }

}
