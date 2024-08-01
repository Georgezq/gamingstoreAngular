import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { API, URL_API } from '../../conexion';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../../../interfaces/usuarioInterface';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;
  private authState = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$: Observable<any | null> = this.currentUserSubject.asObservable();
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

  constructor(private http: HttpClient, app: FirebaseApp) {
    this.auth = getAuth(app);
    const storedUser = localStorage.getItem('whentheuserislogged');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser).user);
    }
  }

  private api = URL_API;

  private hasToken(): boolean {
    return localStorage.getItem('whentheuserislogged') !== null;
  }

  get isAuthenticated() {
    return this.authState.asObservable();
  }


  router = inject(Router);
  route$ = inject(ActivatedRoute);

  user: Usuario[] = [];



  loginSendData(id: string): Observable<any> {
    return this.http.get(`${this.api}usuario/${id}`);
  }

  updateUserData(id: string, user: Usuario ): Observable<any> {
    return this.http.put(`${this.api}usuario/${id}`, user)
  }


  register({email, password}: any) {
    const auth = getAuth()
      return createUserWithEmailAndPassword(this.auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
        }).catch((error) => {
          return Promise.reject(error)});
    }

  login( {email, password}: any){
    const auth = getAuth()
    const responses = '';
    return signInWithEmailAndPassword(this.auth,email, password).then(async (userCredential) => {
      // Signed in
      const user = auth.currentUser;
      const fecha = auth.currentUser.metadata.creationTime.toString();
      if(user !== null){
        const correo = user.email;
        const photoUrl = auth.currentUser.photoURL;
        const token = await user.getIdToken();
        const UserName = auth.currentUser.displayName;


        // Datos del usuario que serán enviados al backend
        const usuario = {
          displayName: UserName || '',
          email: correo,
          imagenperfil: photoUrl || '',
          fechacreacion: fecha,
          redesSociales: {
            discord: '',
            steam: '',
            youtube: '',
          }
        };

        // Enviar los datos del usuario al backend
        this.http.post(`${URL_API}usuario`, usuario).subscribe(response => {
          const tokenGenerator = {
            responses: response,
            UserName: UserName,
            correo: correo,
            user: usuario
          }
          localStorage.setItem('whentheuserislogged', JSON.stringify(tokenGenerator));
          this.currentUserSubject.next(usuario);
          this.authState.next(true);
        });
      }
    })
    .catch((error) => {
      return Promise.reject(error);
    });
  }

  loginWithGitHub(): Promise<any>{
    const provider = new GithubAuthProvider();
    provider.addScope('repo');
    const auth = getAuth();
    return signInWithPopup(this.auth, provider).then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const token = credential.accessToken;
      const user = auth.currentUser;
      const fecha = auth.currentUser.metadata.creationTime.toString();

      console.log(user);
      if(user !== null){
        const correo = user.email;
        const token = await user.getIdToken();
        const photoUrl = auth.currentUser.photoURL;
        const UserName = auth.currentUser.displayName;

        const usuario = {
          displayName: UserName,
          email: correo,
          imagenperfil: photoUrl,
          fechacreacion: fecha,
          redesSociales: {
            discord: '',
            steam: '',
            youtube: '',
          }
        };

        // Enviar los datos del usuario al backend
        this.http.post(`${URL_API}usuario`, usuario).subscribe(response => {
          const tokenGenerator = {
            responses: response,
            UserName: UserName,
            correo: correo,
            user: usuario
          }
          localStorage.setItem('whentheuserislogged', JSON.stringify(tokenGenerator));
          this.authState.next(true);
        });
      }

    });;
  }

  loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();


    // Agrega los alcances necesarios si los hay
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const auth = getAuth();
    return signInWithPopup(this.auth, provider).then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const token = credential.accessToken;
      const user = auth.currentUser;
      const fecha = auth.currentUser.metadata.creationTime.toString();

      console.log(user);
      if(user !== null){
        const correo = user.email;
        const token = await user.getIdToken();
        const photoUrl = auth.currentUser.photoURL;
        const UserName = auth.currentUser.displayName;

        const usuario = {
          displayName: UserName,
          email: correo,
          imagenperfil: photoUrl,
          fechacreacion: fecha,
          redesSociales: {
            discord: '',
            steam: '',
            youtube: '',
          }
        };

        // Enviar los datos del usuario al backend
        this.http.post(`${URL_API}usuario`, usuario).subscribe(response => {
          const tokenGenerator = {
            responses: response,
            UserName: UserName,
            user: usuario
          }
          localStorage.setItem('whentheuserislogged', JSON.stringify(tokenGenerator));
          this.currentUserSubject.next(usuario);
          this.authState.next(true);
        });
      }

    });
  }

  signOutSession(){
    const auth = getAuth();
    return signOut(this.auth).then(() => {
      const removeItems1 = 'isLoggedIn';
      const email = 'valueEmail';
      const value =  'value';
      const userLogin = 'whentheuserislogged';
      localStorage.removeItem(removeItems1);
      localStorage.removeItem(email);
      localStorage.removeItem(value);
      localStorage.removeItem(userLogin);

      this.authState.next(false);

    }).catch((error) => {
      console.log('Error al cerrar la sesión:', error);
    })
  }

  getUserEmail(): string {
    const user = JSON.parse(localStorage.getItem('whentheuserislogged') || '{}');
    return user.correo || '';
  }

  isLogged(): boolean {
    const verifyToken = localStorage.getItem('whentheuserislogged');
    return verifyToken != null;
  }

  isLoggedTheMainUser(): boolean {
    const verifyToken = localStorage.getItem('whentheuserislogged');
    const userId = this.route$.snapshot.paramMap.get('id');


      const parsedData = JSON.parse(verifyToken);
      const userMainLogged = parsedData.responses.id;


      if(userId === userMainLogged ){
        return true;
      } else {
        return false;
      }
  }


}
