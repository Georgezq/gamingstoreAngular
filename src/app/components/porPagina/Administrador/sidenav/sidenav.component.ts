import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule, NgClass, NgIf, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{

  activeIndex: number = 0; // Índice del botón activo

    ngOnInit(): void {
    }

    changeClass(index: number): void {
    this.activeIndex = index;
  }

}
