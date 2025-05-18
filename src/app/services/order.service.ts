import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from '../models/cart-item.interface';

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderShipping {
  street: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id?: string;
  customer: OrderCustomer;
  shipping: OrderShipping;
  items: CartItem[];
  totalAmount: number;
  orderDate: Date;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];

  constructor() {
    // Initialize from localStorage if available
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        this.orders = JSON.parse(savedOrders);
      } catch (error) {
        console.error('Error loading orders from localStorage', error);
        this.orders = [];
      }
    }
  }

  // Mock method to place an order - in a real app, this would call an API
  placeOrder(order: Order): Observable<Order> {
    // Generate a unique ID for the order
    const newOrder: Order = {
      ...order,
      id: 'ORD' + Date.now().toString(),
      status: 'pending'
    };
    
    this.orders.push(newOrder);
    
    // Save to localStorage for persistence
    this.saveOrders();
    
    return of(newOrder);
  }

  // Get all orders
  getOrders(): Observable<Order[]> {
    return of(this.orders);
  }

  // Get order by ID
  getOrderById(id: string): Observable<Order | undefined> {
    const order = this.orders.find(o => o.id === id);
    return of(order);
  }

  // Update order status
  updateOrderStatus(id: string, status: Order['status']): Observable<Order | undefined> {
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex > -1 && status) {
      this.orders[orderIndex].status = status;
      this.saveOrders();
      return of(this.orders[orderIndex]);
    }
    return of(undefined);
  }

  // Save orders to localStorage
  private saveOrders(): void {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }
} 