import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        const userData: User = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          isAdmin: true,
          wishlist: [],
          orderHistory: [],
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          phoneNumber: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.currentUserSubject.next(userData);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  register(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;

        const userData: User = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          isAdmin: true,
          wishlist: [],
          orderHistory: [],
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          phoneNumber: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(this.firestore, 'users', user.uid), userData);
        this.currentUserSubject.next(userData);

        return userData;
      })
      .catch(error => {
        console.error('Error registering user:', error);
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;

        const userData: User = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          isAdmin: true,
          wishlist: [],
          orderHistory: [],
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          phoneNumber: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.currentUserSubject.next(userData);
        return userData;
      })
      .catch(error => {
        console.error('Error logging in:', error);
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)
      .then(() => {
        this.currentUserSubject.next(null);
      })
      .catch(error => {
        console.error('Error logging out:', error);
        throw error;
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user?.isAdmin)
    );
  }
} 