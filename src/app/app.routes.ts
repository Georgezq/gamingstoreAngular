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

export const routes: Routes = [

  //Paginas Principales
  {path: 'home', component: InicioComponent},
  {path: 'tendencias', component: TendenciasComponent},
  {path: 'comunidad', component: ComunidadComponent},
  {path: 'noticias', component: NoticiasComponent},
  {path: 'soporte', component: SoporteComponent},

  {path: 'comprar/:id', component: TiendaJuegoComponent, data: { hideNavbarFooter: true }},

  //Auth
  {path: 'login', component: AuthComponent, data: { hideNavbarFooter: true }},

  //Administracion
  {path: 'admin', component: SidenavComponent, data: { hideNavbarFooter: true }, canActivate: [authVerifiedGuard],
    children: [
      {path: 'juegos', component: AuthComponent}, //PARA CUANDO HAGAS ESTO, ADMINISTRA BIEN LAS RUTAS HIJAS
    ]
  },

  //Perfil y administracion del usuario

  {path: 'user/:id', component: UserPageComponent,
    //canActivate: [authVerifiedGuard],
    children: [
          {path: 'dashboard', component: DashboardComponent},
          {path: 'pedidos', component: PedidosComponent},
          {path: 'deseados', component: WishlistComponent},
          {path: 'cuenta', component: ConfiguracionUserComponent,
            children: [
              {path: 'update-profile', component: ProfileUpdateComponent},
              {path: 'update-email', component: UpdateAuthComponent},
              {path: '**', pathMatch:'full', redirectTo: 'update-profile'}
            ],
          },
          {path: '**', pathMatch:'full', redirectTo: 'dashboard'}
        ]
  },

  //Aqui pretendo hacer la compra del juego

  {path: 'carrito', component: InicioComponent},

  {path: '**', pathMatch:'full', redirectTo: 'home'}

];
