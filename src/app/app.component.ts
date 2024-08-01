import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/Generales/navbar/navbar.component';
import { FooterComponent } from './components/Generales/footer/footer.component';
import { filter } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  showNavbarFooter = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private primengConfig: PrimeNGConfig) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let currentRoute = this.activatedRoute.root;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }
      this.showNavbarFooter = !currentRoute.snapshot.data['hideNavbarFooter'];
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
}


}
