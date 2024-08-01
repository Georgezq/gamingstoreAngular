import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, doc, docData } from '@angular/fire/firestore';
import { DocumentData, DocumentReference, addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { Juegos } from '../../../interfaces/juegosInterface';
import { Informacion } from '../../../interfaces/informacionInterface';

const PATH = 'juegos'

@Injectable({
  providedIn: 'root'
})
export class JuegosService {

  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

  juegos$: Observable<Juegos[]>;

  _collecion = collection(this.firestore, "juegos");

  agregarJuego(juego: Juegos): Promise<DocumentReference<DocumentData>> {
    const juegosCollection = collection(this.firestore, 'juegos');
    return addDoc(juegosCollection, juego);
  }

  agregarInformacion(informacion: Informacion): Promise<DocumentReference<DocumentData>> {
    const infoCollection = collection(this.firestore, 'informacion');
    return addDoc(infoCollection, informacion);
  }

  obtenerJuegos(): Observable<Juegos[]> {
    const _coleccion = collection(this.firestore, 'juegos');
    return collectionData(_coleccion, { idField: 'id' }) as Observable<Juegos[]>;
  }

  obtenerJuegosId(): Observable<string[]> {
    const _coleccion = collection(this.firestore, 'juegos');
    return collectionData(_coleccion, { idField: 'id' }).pipe(
      map((juegos: any[]) => juegos.map(juego => juego.id))
    );
  }

  editarJuego(id: any, juegos: Partial<Juegos>): Promise<void> {
    const destinoDocRef = doc(this.firestore, `juegos/${id}`);
    return updateDoc(destinoDocRef, juegos);
  }

  eliminarDestino(id: any): Promise<void> {
    const destinoDocRef = doc(this.firestore, `juegos/${id}`);
    return deleteDoc(destinoDocRef);
  }


  obtenerJuegoPorId(id: string): Observable<Juegos> {
    const docRef = doc(this.firestore, `juegos/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Juegos>;
  }

  obtenerInformacionPorJuegoId(juegoId: string): Observable<Informacion> {
    const collectionRef = collection(this.firestore, 'informacion');
    const q = query(collectionRef, where('juegoId', '==', juegoId));
    return collectionData(q, { idField: 'id' }).pipe(
      map(informacionArray => informacionArray[0])
    ) as Observable<Informacion>;
  }

}
