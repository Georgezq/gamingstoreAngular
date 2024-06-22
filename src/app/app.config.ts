import { ApplicationConfig, importProvidersFrom } from '@angular/core';


import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import firebase from 'firebase/compat/app'
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

firebase.initializeApp(environment.firebase)
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
    ),
    AuthService,
    importProvidersFrom(HttpClientModule),
    { provide: LocationStrategy, useClass: HashLocationStrategy },


    provideFirebaseApp(() =>
      initializeApp({"projectId":"venta-pag","appId":"1:968148514687:web:fea96a4ce164b775bc4c4a","storageBucket":"venta-pag.appspot.com","apiKey":"AIzaSyDtPJTM1xjYTZS4xvHe1r1yBrO5-uX_8z8","authDomain":"venta-pag.firebaseapp.com","messagingSenderId":"968148514687"})),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()), provideAnimationsAsync()
    ]
};
