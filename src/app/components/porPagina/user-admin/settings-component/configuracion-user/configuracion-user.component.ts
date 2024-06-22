import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-configuracion-user',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './configuracion-user.component.html',
  styleUrl: './configuracion-user.component.css'
})
export class ConfiguracionUserComponent {

}
