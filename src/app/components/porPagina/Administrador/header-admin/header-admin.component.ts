import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DividerModule ],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {

}
