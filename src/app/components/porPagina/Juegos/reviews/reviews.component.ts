import { Component, Input, OnInit, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ReviewsService } from '../../../../services/mongodb/reviews-admin/reviews.service';
import { Reviews, ReviewsForm } from '../../../../interfaces/reviewsInterface';
import { AuthService } from '../../../../services/firebase/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { DefaultProfileImageDirective } from '../../../../directivas/default-profile-image.directive';
import { NgClass, NgFor } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';



@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ConfirmDialogModule,ToastModule,NgClass,ReactiveFormsModule,DividerModule, RouterLink, DefaultProfileImageDirective, NgFor, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
  providers: [ReviewsService, MessageService,ConfirmationService ]
})
export class ReviewsComponent implements OnInit{

  @Input() juegoId: string;
  reviewForm: FormGroup;
  reviewCount: number;
  reviews: any[] = [];
  cantidadReviews: string;
  fecha: string;
  mensajeNo: any;

  display: boolean = false;

  selected: 'like' | 'dislike' | null = null;

  userPerfil: string;
  userId: any;
  userLoggedId: any;


  reviews$ = inject(ReviewsService);
  usuarios$ = inject(AuthService);
  routes$ = inject(Router);

  visible: boolean = false;

  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {
    const loggedIndicator = localStorage.getItem('whentheuserislogged');

    if(loggedIndicator) {
      const parsedData = JSON.parse(loggedIndicator);
      const id = parsedData.responses.id;
      this.usuarios$.loginSendData(id).subscribe((res) =>{
        this.userLoggedId = id;
      })
    }
  }

  showDialog() {
    if(this.userLoggedId != undefined) {
      this.visible = true;
      console.log(this.userLoggedId)

    } else{
      this.routes$.navigate(['login']);
      console.log(this.userLoggedId)
    }
  }

  closeDialog() {
    this.visible = false;
  }


  select(option: 'like' | 'dislike') {
    this.selected = option;
  }

  get pros() {
    return this.reviewForm.get('pros') as FormArray;
  }

  get contras() {
    return this.reviewForm.get('contras') as FormArray;
  }

  onSubmit(){
    const reviewData: Reviews = {
      id_usuario: this.userLoggedId,
      id_juego: this.juegoId,
      comentario: this.reviewForm.value.comentario,
      calificacion: this.selected === 'like',
      pros: this.reviewForm.value.pros.filter(pro => pro !== ''),
      contras: this.reviewForm.value.contras.filter(contra => contra !== ''),
      likes: 0,
      dislikes: 0
    };

    this.reviews$.sendReviews(reviewData).subscribe(() => {
      this.reviewForm.reset();
      this.closeDialog();
    });


  }

  ngOnInit(): void {
    this.getReviews();
    this.getReviewCount();

    this.reviewForm = this.fb.group({
      comentario: ['', Validators.requiredTrue],
      pros: this.fb.array([this.fb.control(''), this.fb.control(''), this.fb.control('')]),
      contras: this.fb.array([this.fb.control(''), this.fb.control(''), this.fb.control('')])
    });

  }

  getReviewCount(): void {
    this.reviews$.countReviewsByGame(this.juegoId).subscribe(
      (response) => {
        this.reviewCount = response.reviewCount;
      },
      (error) => {
        console.error('Error al obtener el número de reviews:', error);
      }
    );
  }

  getReviews(): void {
    try {
      this.reviews$.getReviewsByIdGame(this.juegoId).subscribe(
        (response) => {
         
          if (response && response.length > 0) {
            this.reviews = response;
            // Procesar las reviews
            this.reviews.forEach(review => {
              this.userId = review.id_usuario;
              const fechaDate = new Date(review.fecha);
              const opciones: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              };
              review.fecha = fechaDate.toLocaleDateString('es-ES', opciones);
            });
  
            this.reviews.forEach(review => {
              this.usuarios$.loginSendData(review.id_usuario).subscribe(userInfo => {
                review.userInfo = userInfo;
                this.userPerfil = userInfo.imagenperfil;
              });
            });
          } else {
            console.log('No reviews found for this game.');
            this.reviews = []; 
          }
        },
        () => {
          this.mensajeNo = 'Todavia no hay ninguna review para este juego!'
        }
      );      
  
    } catch (error) {
      console.error('Error al intentar obtener las reviews:', error);
    }
  }
  

  //Enviar likes y dislikes

  likeReview(reviewId: string) {
    this.reviews$.likeReview(reviewId).subscribe(
      response => {
        console.log('Review liked:', response);
        this.getReviews(); // Recargar reviews después de dar like
      },
      error => {
        console.error('Error liking review:', error);
      }
    );
  }

  dislikeReview(reviewId: string) {
    this.reviews$.dislikeReview(reviewId).subscribe(
      response => {
        console.log('Review disliked:', response);
        this.getReviews(); // Recargar reviews después de dar dislike
      },
      error => {
        console.error('Error disliking review:', error);
      }
    );
  }


  //Eventos cuando se crea o se cancela el insertar una review




}
