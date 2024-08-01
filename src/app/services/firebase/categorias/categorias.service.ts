import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categorias } from '../../../interfaces/categoriasInterface';
import { Firestore, collectionData, doc, docData } from '@angular/fire/firestore';
import { DocumentData, DocumentReference, addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore

  juegos$: Observable<Categorias[]>;

  _collecion = collection(this.firestore, "categorias");

  obtenerCategorias(): Observable<Categorias[]> {
    const _coleccion = collection(this.firestore, 'categorias');
    return collectionData(_coleccion, { idField: 'id' }) as Observable<Categorias[]>;
  }

  obtenerJuegoPorId(id: string): Observable<Categorias> {
    const docRef = doc(this.firestore, `categorias/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Categorias>;
  }

  agregarCategoria(categoria: Categorias): Promise<DocumentReference<DocumentData>> {
    const juegosCollection = collection(this.firestore, 'categorias');
    return addDoc(juegosCollection, categoria);
  }

  editarCategoria(id: any, categoria: Partial<Categorias>): Promise<void> {
    const destinoDocRef = doc(this.firestore, `categorias/${id}`);
    return updateDoc(destinoDocRef, categoria);
  }

  eliminarCategoria(id: any): Promise<void> {
    const destinoDocRef = doc(this.firestore, `categorias/${id}`);
    return deleteDoc(destinoDocRef);
  }

}
