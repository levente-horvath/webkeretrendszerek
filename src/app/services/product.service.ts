import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly collectionName = 'products';

  constructor(private firestore: Firestore) {}

  getProducts(): Observable<Product[]> {
    return from(getDocs(collection(this.firestore, this.collectionName))).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
      ),
      catchError(error => {
        console.error('Error getting products:', error);
        return of([]);
      })
    );
  }

  getProductById(id: string): Observable<Product | null> {
    return from(getDoc(doc(this.firestore, this.collectionName, id))).pipe(
      map(doc => {
        if (doc.exists()) {
          return {
            id: doc.id,
            ...doc.data()
          } as Product;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error getting product:', error);
        return of(null);
      })
    );
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('category', '==', categoryId)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
      ),
      catchError(error => {
        console.error('Error getting products by category:', error);
        return of([]);
      })
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<string> {
    return from(addDoc(collection(this.firestore, this.collectionName), {
      ...product,
      createdAt: new Date()
    })).pipe(
      map(docRef => docRef.id),
      catchError(error => {
        console.error('Error adding product:', error);
        throw error;
      })
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<void> {
    return from(updateDoc(doc(this.firestore, this.collectionName, id), {
      ...product,
      updatedAt: new Date()
    })).pipe(
      catchError(error => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, this.collectionName, id))).pipe(
      catchError(error => {
        console.error('Error deleting product:', error);
        throw error;
      })
    );
  }

  getProductsByPrice(): Observable<Product[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      orderBy('price', 'asc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
      ),
      catchError(error => {
        console.error('Error getting products by price:', error);
        return of([]);
      })
    );
  }

  getProductsByRating(): Observable<Product[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      orderBy('rating', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
      ),
      catchError(error => {
        console.error('Error getting products by rating:', error);
        return of([]);
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('rating', '>=', 4),
      where('stock', '>', 0),
      limit(5)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
      ),
      catchError(error => {
        console.error('Error getting featured products:', error);
        return of([]);
      })
    );
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
      ),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  }

  getPaginatedProducts(pageSize: number, lastDoc?: any): Observable<Product[]> {
    let q = query(
      collection(this.firestore, this.collectionName),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
      ),
      catchError(error => {
        console.error('Error getting paginated products:', error);
        return of([]);
      })
    );
  }
} 