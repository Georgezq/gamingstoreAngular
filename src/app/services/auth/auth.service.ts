import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { URL_API } from '../conexion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../interfaces/usuarioInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private auth: Auth, private http: HttpClient) { }

  private api = URL_API;

  router = inject(Router);

  user: Usuario[] = [];



  loginSendData(id: string): Observable<any> {
    return this.http.get(`${this.api}usuario/${id}`);
  }

  updateUserData(id: string, user: Usuario ): Observable<any> {
    return this.http.put(`${this.api}usuario/${id}`, user)
  }

  countReviewsByUser(userId: string): Observable<any> {
    return this.http.get(`${URL_API}/reviews/countU/${userId}`);
  }


  register({email, password}: any) {
  const auth = getAuth()
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
                console.log(user);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  login( {email, password}: any){
    const auth = getAuth()
    const responses = '';
    return signInWithEmailAndPassword(auth,email, password).then(async (userCredential) => {
      // Signed in
      const user = auth.currentUser;
      const fecha = auth.currentUser.metadata.creationTime.toString();
      console.log(user);
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
          console.log('Usuario guardado en MongoDB', response);
          const tokenGenerator = {
            responses: response,
            UserName: UserName,
            correo: correo
          }
          localStorage.setItem('whentheuserislogged', JSON.stringify(tokenGenerator));
        });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();


    // Agrega los alcances necesarios si los hay
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const auth = getAuth();
    return signInWithPopup(auth, provider).then(async (result) => {
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
          console.log('Usuario guardado en MongoDB', response);
          const tokenGenerator = {
            responses: response,
            UserName: UserName,
            correo: correo
          }
          localStorage.setItem('whentheuserislogged', JSON.stringify(tokenGenerator));
        });
      }

    });
  }

  loginWithFacebook(): Promise<any>{
    const provider = new FacebookAuthProvider();
    provider.addScope('user_birthday');
    const auth = getAuth();
    return signInWithPopup(auth, provider);
  }

  loginWithGitHub(): Promise<any>{
    const provider = new GithubAuthProvider();
    provider.addScope('repo');
    const auth = getAuth();
    return signInWithPopup(auth, provider);
  }

  signOutSession(){
    const auth = getAuth();
    return signOut(auth).then(() => {
      console.log('Sesion cerrada');
      localStorage.removeItem('whentheuserislogged');
    }).catch((error) => {
      console.log('Error al cerrar la sesión:', error);
    })
  }

  isLogged(): boolean {
    const verifyToken = localStorage.getItem('whentheuserislogged');
    return verifyToken != null;
  }


}
