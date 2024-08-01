import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-noticias-content',
  standalone: true,
  imports: [MatSidenavModule, NgClass, NgIf, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './noticias-content.component.html',
  styleUrl: './noticias-content.component.css'
})
export class NoticiasContentComponent {

}
