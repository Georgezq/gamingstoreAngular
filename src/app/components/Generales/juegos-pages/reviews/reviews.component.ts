import { Component, Input, OnInit, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ReviewsService } from '../../../../services/reviews-admin/reviews.service';
import { Reviews, ReviewsForm } from '../../../../interfaces/reviewsInterface';
import { AuthService } from '../../../../services/auth/auth.service';
import { RouterLink } from '@angular/router';
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

  display: boolean = false;

  selected: 'like' | 'dislike' | null = null;

  userPerfil: string;
  userId: any;
  userLoggedId: any;


  reviews$ = inject(ReviewsService);
  usuarios$ = inject(AuthService);

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
      this.visible = true;
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
    this.getReviewCount();
    this.getReviews();

    this.reviewForm = this.fb.group({
      comentario: ['', Validators.requiredTrue],
      pros: this.fb.array([this.fb.control(''), this.fb.control(''), this.fb.control('')]),
      contras: this.fb.array([this.fb.control(''), this.fb.control(''), this.fb.control('')])
    });

  }

  getReviews(): void {
    this.reviews$.getReviewsByIdGame(this.juegoId).subscribe(
      (response) => {
        this.reviews = response;

        // Itera sobre cada review para obtener y formatear la fecha
        this.reviews.forEach(review => {
          this.userId = review.id_usuario;

          const fechaDate = new Date(review.fecha); // Suponiendo que la fecha está almacenada en un campo 'fecha'
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

      },
      (error) => {
        console.error('Error al obtener las reviews:', error);
      }
    );
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


  //Eventos cuando se crea o se cancela el insertar una review

  sendReview(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

cancelSendReview(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
}



}
