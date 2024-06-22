import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-auth.component.html',
  styleUrl: './update-auth.component.css'
})
export class UpdateAuthComponent implements OnInit{

  user: string;

  ngOnInit(): void {
    const storedData = localStorage.getItem('whentheuserislogged');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const correo = parsedData.correo;
      if (correo) {
        this.user = correo;
      }
    }
  }
}
