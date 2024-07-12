import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../../services/firebase/auth/auth.service';
import { Usuario } from '../../../../../interfaces/usuarioInterface';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NgFor],
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.css',
  providers: [HttpClient, AuthService]

})
export class ProfileUpdateComponent implements OnInit {

  userName: any;
  userId: any;
  discord: string;
  steam: string;
  youtube: string;
  

  auth$ = inject(AuthService);

  userForm: FormGroup;
  userUpdate: Usuario = {
    displayName: '',
    redesSociales: {
      discord: '',
      steam: '',
      youtube: ''
    }
  };

  constructor(private fb: FormBuilder){}


  ngOnInit(): void {

    this.inicializarFormulario();
    this.ObtenerValores();

  }

  private ObtenerValores(): void {
    const storedData = localStorage.getItem('whentheuserislogged');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const correo = parsedData.correo;
      const id = parsedData.responses.id;
      this.userId = id;
      this.auth$.loginSendData(id).subscribe((res) =>{
        this.discord = res.redesSociales.discord;
        this.steam = res.redesSociales.steam;
        this.youtube = res.redesSociales.youtube;
        if(parsedData.UserName == null) {
          this.userName = correo.split('@')[0];

        } else {
          this.userName = res.displayName;
        }
        // Actualizamos el valor del formulario después de obtener los datos
        this.userForm.patchValue({ displayName: this.userName });
        this.userForm.patchValue({redesSociales: {
          discord: this.discord,
          steam: this.steam,
          youtube: this.youtube
        }});



      })
    }
  }

  private inicializarFormulario(): void {
    this.userForm = this.fb.group({
      displayName: [''], // Inicializamos el control con una cadena vacía
      redesSociales: this.fb.group({
        discord: [''],
        steam: [''],
        youtube: ['']
      })
    });
  }

  onSubmit() {
    const userData: Usuario = {
      displayName: this.userForm.value.displayName,
      redesSociales: {
        discord: this.userForm.value.redesSociales.discord,
        steam: this.userForm.value.redesSociales.steam,
        youtube: this.userForm.value.redesSociales.youtube,
      }
    };

    this.auth$.updateUserData(this.userId, userData).subscribe(
      (response) => {
        this.userName = '';
      },
      (error) => {
      //  console.error('Error al actualizar datos:', error);
      }
    );

   // console.log(this.userForm.value);
  }

}
