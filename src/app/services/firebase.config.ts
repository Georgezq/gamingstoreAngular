import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { getAuth } from 'firebase/auth';
import { provideAuth } from '@angular/fire/auth';

const firebaseProviders: EnvironmentProviders = importProvidersFrom(

)

export { firebaseProviders }
