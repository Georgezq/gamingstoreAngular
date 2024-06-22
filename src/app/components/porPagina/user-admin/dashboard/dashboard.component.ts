import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [HttpClient, AuthService]

})
export class DashboardComponent implements OnInit{

  auth$ = inject(AuthService);

  amigos: string;
  reviews: any;
  deseados: string;
  juegos: string;
  idUser: any;

  ngOnInit(): void {
    const storedData = localStorage.getItem('whentheuserislogged');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.idUser = parsedData.responses.id;

    }

    this.getReviewCount();
  }


  getReviewCount(): void {
    this.auth$.countReviewsByUser(this.idUser).subscribe(
      (response) => {
        this.reviews = response.reviewCount;
      },
      (error) => {
        console.error('Error al obtener el número de reviews:', error);
      }
    );
  }

}
