import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../services/firebase/auth/auth.service';
import { Usuario } from '../../../../../interfaces/usuarioInterface';
import { NgFor, NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {  ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgIf,ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.css',
  providers: [HttpClient, AuthService, MessageService, ConfirmationService]
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

  constructor(private fb: FormBuilder, private messageService: MessageService){}


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
        discord: ['', ],
        steam: ['', [Validators.pattern('https?://.+')]],
        youtube: ['', [Validators.pattern('https?://.+')]]
      })
    });
  }

  get redesSociales() {
    return this.userForm.get('redesSociales') as FormGroup;
  }

  // Método para mostrar mensajes de error si es necesario
  getUrlErrorMessage(controlName: string): string {
    const control = this.redesSociales.get(controlName);
    if (control?.hasError('pattern')) {
      return 'Por favor ingrese una URL válida';
    }
    return '';
  }

  onSubmit() {
    if(this.userForm.valid){
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
          if(response.redesSociales.discord == '' && response.redesSociales.youtube == '' && response.redesSociales.steam == ''){
            this.messageService.add({ severity: 'error', summary: '', detail: 'Llene un campo!' });
          } else {
            this.messageService.add({ severity: 'info', summary: 'Listo!', detail: 'Tu perfil se ha actualizado' });
          }
          this.userName = '';

        },
        (error) => {
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Hubo un problema!', detail: 'Revisa correctamente el campo a actualizar' });
    }
  }

}
