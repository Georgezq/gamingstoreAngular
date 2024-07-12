import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/firebase/auth/auth.service';
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
    .then(async (response) => {
      if(response !== null){
        await this.router.navigate(['/']);
      }    })
    .catch(error => console.log(error))
  }

  registerWithEmailAndPassword(): void {
    this.auth.register(this.formReg.value)
    .then(async (response) => {
      if(response !== null){
        await this.router.navigate(['/']);
      }
    })
    .catch(error => console.log(error))
  }

  loginGoogle(): void {
    this.auth.loginWithGoogle()
      .then(async (response) => {
        if(response !== null){
          await this.router.navigate(['/']);
        }
      })
      .catch(error => console.log(error))
  }

  loginFacebook(): void {
    this.auth.loginWithFacebook()
      .then((result) => {
        console.log(result);
      })
      .catch(error => console.log(error))
  }

  loginGithub(): void {
    this.auth.loginWithGitHub()
      .then((result) => {
        console.log(result);
      })
      .catch(error => console.log(error))
  }

}
