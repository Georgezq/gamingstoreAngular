import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Portada } from '../../../interfaces/portadaInicioInterface';
import { collection, doc, updateDoc} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImageninicioService {

  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

  juegos$: Observable<Portada[]>;

  _collecion = collection(this.firestore, "imageninicio");

  obtenerPortada(): Observable<Portada[]> {
    const _coleccion = collection(this.firestore, 'imageninicio');
    return collectionData(_coleccion, { idField: 'id' }) as Observable<Portada[]>;
  }

  obtenerPortadaId(): Observable<string[]> {
    const _coleccion = collection(this.firestore, 'imageninicio');
    return collectionData(_coleccion, { idField: 'id' }).pipe(
      map((portada: any[]) => portada.map(portada => portada.id))
    );
  }

  editarPortada(id: any, portada: Partial<Portada>): Promise<void> {
    const destinoDocRef = doc(this.firestore, `imageninicio/${id}`);
    return updateDoc(destinoDocRef, portada);
  }

}
