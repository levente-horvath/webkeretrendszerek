import { Injectable } from '@angular/core';
import { Auth, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isOnline = navigator.onLine;
  private userCache = new Map<string, User>();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  async getUserById(userId: string): Promise<User | null> {
    if (this.userCache.has(userId)) {
      return this.userCache.get(userId) || null;
    }

    if (!this.isOnline) {
      const cachedUser = this.userCache.get(userId);
      if (cachedUser) {
        return cachedUser;
      }

      const authUser = this.auth.currentUser;
      if (authUser && authUser.uid === userId) {
        const basicUser: User = {
          id: authUser.uid,
          email: authUser.email || '',
          displayName: authUser.displayName || '',
          isAdmin: false,
          wishlist: [],
          orderHistory: []
        };
        this.userCache.set(userId, basicUser);
        return basicUser;
      }
      return null;
    }

    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        this.userCache.set(userId, userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    const timestamp = new Date();

    const updateData = {
      ...userData,
      updatedAt: timestamp
    };

    this.userCache.set(userId, { ...this.userCache.get(userId), ...updateData } as User);

    if (!this.isOnline) {
      console.warn('You are offline. Changes will be synced when you are back online.');
      return;
    }

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, updateData);
      } else {
        await setDoc(userRef, {
          ...updateData,
          createdAt: timestamp
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, profileData: Partial<User>): Promise<void> {
    if (!this.isOnline) {
      console.warn('You are offline. Changes will be synced when you are back online.');
      return;
    }

    await this.updateUser(userId, profileData);
  }

  async addToWishlist(userId: string, productId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const wishlist = [...(user.wishlist || [])];
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      await this.updateUser(userId, { wishlist });
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const wishlist = (user.wishlist || []).filter(id => id !== productId);
    await this.updateUser(userId, { wishlist });
  }

  async addToOrderHistory(userId: string, orderId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const orderHistory = [...(user.orderHistory || [])];
    if (!orderHistory.includes(orderId)) {
      orderHistory.push(orderId);
      await this.updateUser(userId, { orderHistory });
    }
  }
} 