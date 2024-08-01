import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from '../../../../services/conexion';

@Component({
  selector: 'app-successful',
  standalone: true,
  imports: [],
  templateUrl: './successful.component.html',
  styleUrl: './successful.component.css'
})
export class SuccessfulComponent implements OnInit{

  route$ = inject(ActivatedRoute);
  router$ = inject(Router);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
      this.verificarCompra();
  }

  verificarCompra(){
    const sessionId = this.route$.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.http.get(`${API}/checkout/session/${sessionId}`).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.snackBar.open('Compra realizada correctamente', 'Cerrar', {
              duration: 10000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.router$.navigate(['/home'])
          }
        },
        error: (err) => {
          console.error('Error', err);
        }
      });
    }
  }

}
