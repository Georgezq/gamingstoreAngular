import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css'
})
export class AdminCategoriasComponent {

}
