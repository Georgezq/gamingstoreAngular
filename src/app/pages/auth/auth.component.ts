import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, RouterLink, ReactiveFormsModule, HttpClientModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  providers: [HttpClient, AuthService]
})
export class AuthComponent {

  showLogin = true;
  isLogged = false;
 // providerGoogle = new GoogleAuthProvider();


 formReg: FormGroup;

  toggleForm() {
    this.showLogin = !this.showLogin;
  }

  constructor(private auth: AuthService, private router: Router){
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    })

  }

  signInWithEmailAndPassword(): void {
    this.auth.login(this.formReg.value)
    .then((res) => {
      //this.router.navigate(['/']);
    })
    .catch(error => console.log(error))
  }

  registerWithEmailAndPassword(): void {
    this.auth.register(this.formReg.value)
    .then((response) => {
      if(response !== null){
        this.router.navigate(['/']);
      }
    })
    .catch(error => console.log(error))
  }




  loginGoogle(): void {
    this.auth.loginWithGoogle()
      .then((result) => {
        // La autenticación fue exitosa, aquí puedes manejar la respuesta
        console.log(result);
        // Redirigir a la página de inicio u otra acción necesaria
      })
      .catch((error) => {
        // Ocurrió un error durante la autenticación
        console.error('Error durante el inicio de sesión con Google', error);
      });
  }

  loginFacebook(): void {
    this.auth.loginWithFacebook()
      .then((result) => {
        // La autenticación fue exitosa, aquí puedes manejar la respuesta
        console.log(result);
        // Redirigir a la página de inicio u otra acción necesaria
      })
      .catch((error) => {
        // Ocurrió un error durante la autenticación
        console.error('Error durante el inicio de sesión con Facebook', error);
      });
  }

  loginGithub(): void {
    this.auth.loginWithGitHub()
      .then((result) => {
        // La autenticación fue exitosa, aquí puedes manejar la respuesta
        console.log(result);
        // Redirigir a la página de inicio u otra acción necesaria
      })
      .catch((error) => {
        // Ocurrió un error durante la autenticación
        console.error('Error durante el inicio de sesión con Facebook', error);
      });
  }

}
