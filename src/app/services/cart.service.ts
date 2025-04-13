import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  
  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCart();
  }
  
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage', error);
        this.cartItemsSubject.next([]);
      }
    }
  }
  
  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }
  
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }
  
  addToCart(product: Product): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex > -1) {
      // Product already in cart, increase quantity
      const updatedItems = [...currentItems];
      if (updatedItems[existingItemIndex].quantity < product.stock) {
        updatedItems[existingItemIndex].quantity += 1;
        this.cartItemsSubject.next(updatedItems);
        this.saveCart(updatedItems);
      }
    } else {
      // Add new product to cart
      const updatedItems = [...currentItems, { product, quantity: 1 }];
      this.cartItemsSubject.next(updatedItems);
      this.saveCart(updatedItems);
    }
  }
  
  updateQuantity(productId: string, quantity: number): void {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      // Ensure quantity is within valid range
      const product = currentItems[itemIndex].product;
      if (quantity > 0 && quantity <= product.stock) {
        const updatedItems = [...currentItems];
        updatedItems[itemIndex].quantity = quantity;
        this.cartItemsSubject.next(updatedItems);
        this.saveCart(updatedItems);
      }
    }
  }
  
  removeFromCart(productId: string): void {
    const currentItems = this.getCartItems();
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(updatedItems);
    this.saveCart(updatedItems);
  }
  
  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }
  
  getCartTotal(): number {
    return this.getCartItems().reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }
  
  getCartItemCount(): number {
    return this.getCartItems().reduce(
      (count, item) => count + item.quantity, 
      0
    );
  }
} 