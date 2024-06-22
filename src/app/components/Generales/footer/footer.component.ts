import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  ngOnInit(): void {
    this.getFechaAno();
  }

  fecha: any;

  getFechaAno() {
    this.fecha = new Date().getFullYear();
    return this.fecha;

  }


}
