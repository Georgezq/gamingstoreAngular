import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { TendenciasComponent } from './pages/tendencias/tendencias.component';
import { ComunidadComponent } from './pages/comunidad/comunidad.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { AuthComponent } from './pages/auth/auth.component';
import { SidenavComponent } from './components/porPagina/Administrador/sidenav/sidenav.component';
import { TiendaJuegoComponent } from './components/porPagina/Compras/tienda-juego/tienda-juego.component';
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
import { AllNoticiasComponent } from './pages/all-noticias/all-noticias.component';
import { CardsinfoComponent } from './components/porPagina/Administrador/cardsinfo/cardsinfo.component';
import { CestaComponent } from './components/porPagina/Compras/cesta/cesta.component';
import { HeaderAdminComponent } from './components/porPagina/Administrador/header-admin/header-admin.component';
import { AdminPortadaComponent } from './components/porPagina/Administrador/Opciones/admin-portada/admin-portada.component';
import { AdminJuegoseinfoComponent } from './components/porPagina/Administrador/Opciones/admin-juegoseinfo/admin-juegoseinfo.component';
import { AdminjuegosComponent } from './components/porPagina/Administrador/Opciones/admin-juegoseinfo/adminjuegos/adminjuegos.component';
import { VistaJuegosComponent } from './components/porPagina/Administrador/Opciones/admin-juegoseinfo/vista-juegos/vista-juegos.component';
import { AdminCategoriasComponent } from './components/porPagina/Administrador/Opciones/admin-categorias/admin-categorias.component';
import { AdminCatComponent } from './components/porPagina/Administrador/Opciones/admin-categorias/admin-cat/admin-cat.component';
import { VistaCategoriasComponent } from './components/porPagina/Administrador/Opciones/admin-categorias/vista-categorias/vista-categorias.component';
import { AdminNoticiasComponent } from './components/porPagina/Administrador/Opciones/admin-noticias/admin-noticias.component';
import { NoticiasContentComponent } from './components/porPagina/noticias-content/noticias-content.component';
import { InicioNoticiasComponent } from './components/porPagina/noticias-content/inicio-noticias/inicio-noticias.component';
import { loginGuard } from './guards/login/login.guard';
import { roleGuard } from './guards/roles/role.guard';
import { SuccessfulComponent } from './components/porPagina/Compras/successful/successful.component';

export const routes: Routes = [

  //Paginas Principales
  {path: 'home', component: InicioComponent, title: 'Inicio'},
  {path: 'tendencias', component: TendenciasComponent, title: 'Tendencias'},
  {path: 'comunidad', component: ComunidadComponent, title: 'Comunidad'},
  {path: 'noticias', component: NoticiasComponent, title: 'Noticias'},
  {path: 'soporte', component: SoporteComponent, title: 'Soporte'},

  {path: 'newsGaming', component: NoticiasContentComponent, title: 'Noticias de Videojuegos', data: { hideNavbarFooter: true },
    children: [
      {path: 'noticias', component: InicioNoticiasComponent, data: { hideNavbarFooter: true }},
      {path: 'noticia/:titulo', component: AllNoticiasComponent, data: { hideNavbarFooter: true }},
    ]
  },


  {path: 'comprar/:id', component: TiendaJuegoComponent, data: { hideNavbarFooter: true }},

  //Auth
  {path: 'login', component: AuthComponent, title: 'Iniciar Sesión' ,data: { hideNavbarFooter: true }, canActivate: [loginGuard] },

  //Administracion
  {path: 'admin', component: SidenavComponent, data: { hideNavbarFooter: true }, canActivate: [authVerifiedGuard, roleGuard],
    children: [
      {path: 'info-cards', component: CardsinfoComponent,  data: { hideNavbarFooter: true }},
      {path: 'options', component: HeaderAdminComponent,  data: { hideNavbarFooter: true },
      children: [
        //{path: 'noticias-admin'},
        {path: 'noticias-admin', component: AdminNoticiasComponent, data: { hideNavbarFooter: true }},
        {path: 'portada-admin', component: AdminPortadaComponent, data: { hideNavbarFooter: true }},
        {path: 'juegos-admin', component: AdminJuegoseinfoComponent, data: { hideNavbarFooter: true },
          children: [
            {path: 'juegos-add', component: AdminjuegosComponent, data: { hideNavbarFooter: true }},
            {path: 'juegos-view', component: VistaJuegosComponent, data: { hideNavbarFooter: true }},
            {path: '**', pathMatch:'full', redirectTo: 'juegos-add'}
        ]},
        {path: 'categorias-admin', component: AdminCategoriasComponent, data: { hideNavbarFooter: true },
          children: [
            {path: 'categorias-add', component: AdminCatComponent, data: { hideNavbarFooter: true }},
            {path: 'categorias-view', component: VistaCategoriasComponent, data: { hideNavbarFooter: true }},
            {path: '**', pathMatch:'full', redirectTo: 'categorias-add'}
        ]},

      ]},
      {path: '**', pathMatch:'full', redirectTo: 'options'}
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

  {path: 'carrito', component: CestaComponent, data: { hideNavbarFooter: true },
    children: [
    ]
  },
  {path: 'successfull', component: SuccessfulComponent, data: {hideNavbarFooter: true}},


  {path: '', pathMatch:'full', redirectTo: 'home', data: { hideNavbarFooter: true },}

];
