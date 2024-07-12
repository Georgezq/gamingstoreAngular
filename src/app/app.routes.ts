import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { TendenciasComponent } from './pages/tendencias/tendencias.component';
import { ComunidadComponent } from './pages/comunidad/comunidad.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { AuthComponent } from './pages/auth/auth.component';
import { SidenavComponent } from './components/Generales/sidenav/sidenav.component';
import { TiendaJuegoComponent } from './components/porPagina/tienda-juego/tienda-juego.component';
import { DashboardComponent } from './components/porPagina/user-admin/dashboard/dashboard.component';
import { ConfiguracionUserComponent } from './components/porPagina/user-admin/settings-component/configuracion-user/configuracion-user.component';
import { WishlistComponent } from './components/porPagina/user-admin/wishlist/wishlist.component';
import { PedidosComponent } from './components/porPagina/user-admin/pedidos/pedidos.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { ProfileUpdateComponent } from './components/porPagina/user-admin/settings-component/profile-update/profile-update.component';
import { UpdateAuthComponent } from './components/porPagina/user-admin/settings-component/update-auth/update-auth.component';
import { authVerifiedGuard } from './guards/auth/auth-verified.guard';
import { UserPageVisitanteComponent } from './pages/user-page/user-page-visitante/user-page-visitante.component';
import { profileGuard } from './guards/profile/profile.guard';
import { CestaComponent } from './components/porPagina/cesta/cesta.component';
import { AllNoticiasComponent } from './pages/all-noticias/all-noticias.component';
import { AdminjuegosComponent } from './components/porPagina/adminjuegos/adminjuegos.component';
import { CardsinfoComponent } from './components/porPagina/cardsinfo/cardsinfo.component';

export const routes: Routes = [

  //Paginas Principales
  {path: 'home', component: InicioComponent, title: 'Inicio'},
  {path: 'tendencias', component: TendenciasComponent, title: 'Tendencias'},
  {path: 'comunidad', component: ComunidadComponent, title: 'Comunidad'},
  {path: 'noticias', component: NoticiasComponent, title: 'Noticias'},
  {path: 'soporte', component: SoporteComponent, title: 'Soporte'},
  {path: 'noticia/:titulo', component: AllNoticiasComponent, data: { hideNavbarFooter: true }},


  {path: 'comprar/:id', component: TiendaJuegoComponent, data: { hideNavbarFooter: true }},

  //Auth
  {path: 'login', component: AuthComponent, title: 'Iniciar Sesión' ,data: { hideNavbarFooter: true }},

  //Administracion
  {path: 'admin', component: SidenavComponent, data: { hideNavbarFooter: true }, canActivate: [authVerifiedGuard],
    children: [
      {path: 'info-cards', component: CardsinfoComponent,  data: { hideNavbarFooter: true }},
      {path: 'juegos', component: AdminjuegosComponent,  data: { hideNavbarFooter: true }},
      {path: '**', pathMatch:'full', redirectTo: 'info-cards'}
    ]
  },

  //Perfil y administracion del usuario

  {path: 'my-profile/:id', component: UserPageComponent, canActivate: [authVerifiedGuard],
    children: [
          {path: 'dashboard', component: DashboardComponent, title: 'Resumen'},
          {path: 'pedidos', component: PedidosComponent, title: 'Mis pedidos'},
          {path: 'deseados', component: WishlistComponent, title: 'Mis deseados'},
          {path: 'cuenta', component: ConfiguracionUserComponent, title: 'Mi cuenta',
            children: [
              {path: 'update-profile', component: ProfileUpdateComponent},
              {path: 'update-email', component: UpdateAuthComponent},
              {path: '**', pathMatch:'full', redirectTo: 'update-profile'}
            ],
          },
          {path: '**', pathMatch:'full', redirectTo: 'dashboard'}
        ]
  },

  {path: 'profile/:id', component: UserPageVisitanteComponent, canActivate: [profileGuard]},

  //Aqui pretendo hacer la compra del juego

  {path: 'carrito', component: CestaComponent},

  {path: '**', pathMatch:'full', redirectTo: 'home'}

];
