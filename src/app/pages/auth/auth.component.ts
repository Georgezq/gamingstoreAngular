import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/firebase/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  errorMessage: string | null = null;

  formReg: FormGroup;
  private fb = inject(FormBuilder);


  toggleForm() {
    this.showLogin = !this.showLogin;
  }

  constructor(private auth: AuthService, private router: Router){
    this.formReg = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signInWithEmailAndPassword(): void {
    this.auth.login(this.formReg.value)
      .then(response => {
        if (response !== null) {
          Swal.fire({
            title: 'Inicio de sesión exitoso',
            text: 'Serás redirigido a la página principal',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          }).then(
            () => {
               this.router.navigate(['/']);
            }
          )
        }
      })
      .catch( () => {
        Swal.fire({
          title: 'Error al iniciar sesión',
          icon: 'error',
          timer: 2000
        })
      });
  }

  registerWithEmailAndPassword(): void {
    this.auth.register(this.formReg.value)
    .then(async (response) => {
      if(response !== null){
        this.showLogin = true;
        Swal.fire({
          title: 'Inicie sesión con la cuenta creada!',
          icon: 'info',
          timer: 2000,
          timerProgressBar: true,
        })
      }
    })
    .catch(() => {
      Swal.fire({
        title: 'Error de registro',
        icon: 'error',
        timer: 2000
      })
    });
  }

  loginGoogle(): void {
    this.auth.loginWithGoogle()
      .then(async (response) => {
        if(response !== null){
          Swal.fire({
            title: 'Inicio de sesión exitoso',
            text: 'Serás redirigido a la página principal',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          }).then(
            () => {
               this.router.navigate(['/']);
            }
          )
        }
      })
      .catch(error => console.log(error))
  }

  loginGithub(): void {
    this.auth.loginWithGitHub()
    .then(async (response) => {
      if(response !== null){
        Swal.fire({
          title: 'Inicio de sesión exitoso',
          text: 'Serás redirigido a la página principal',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        }).then(
          () => {
             this.router.navigate(['/']);
          }
        )
      }
    })
      .catch(error => console.log(error))
  }

}
