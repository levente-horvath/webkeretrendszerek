import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-complete',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CurrencyFormatPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mat-card class="order-complete-card">
      <mat-card-header>
        <mat-icon mat-card-avatar color="primary">check_circle</mat-icon>
        <mat-card-title>Megrendelés sikeres!</mat-card-title>
        <mat-card-subtitle *ngIf="order">Rendelésszám: {{ order.id }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="success-message">
          <p>Köszönjük a megrendelését! Vásárlását sikeresen rögzítettük!</p>
          <p>Visszaigazoló e-mailt küldtünk a következő címre: <strong *ngIf="order">{{ order.customer.email }}</strong>.</p>
        </div>

        <mat-divider></mat-divider>

        <div *ngIf="order" class="order-details">
          <h3>Rendelés összegzése</h3>
          
          <div class="details-section">
            <h4>Szállítási információk</h4>
            <p><strong>Név:</strong> {{ order.customer.fullName }}</p>
            <p><strong>Cím:</strong> {{ order.shipping.street }}, {{ order.shipping.city }}, {{ order.shipping.postalCode }}</p>
          </div>
          
          <div class="details-section">
            <h4>Rendelt termékek</h4>
            <div class="order-items">
              <div class="order-item" *ngFor="let item of order.items">
                <div class="item-image">
                  <img [src]="item.product.imageUrl" [alt]="item.product.name">
                </div>
                <div class="item-details">
                  <h5>{{ item.product.name }}</h5>
                  <p>Mennyiség: {{ item.quantity }}</p>
                  <p>Ár: {{ item.product.price | currencyFormat }}</p>
                </div>
                <div class="item-total">
                  {{ item.product.price * item.quantity | currencyFormat }}
                </div>
              </div>
            </div>
          </div>

          <div class="details-section totals">
            <div class="total-line">
              <span>Részösszeg:</span>
              <span>{{ getSubtotal() | currencyFormat }}</span>
            </div>
            <div class="total-line">
              <span>Szállítási díj:</span>
              <span>{{ getShippingCost() | currencyFormat }}</span>
            </div>
            <div class="total-line grand-total">
              <span>Végösszeg:</span>
              <span>{{ order.totalAmount | currencyFormat }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="!order" class="loading-order">
          <p>Rendelési adatok betöltése...</p>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-raised-button color="primary" routerLink="/">Vásárlás folytatása</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .order-complete-card {
      max-width: 800px;
      margin: 30px auto;
    }

    .success-message {
      text-align: center;
      margin: 20px 0;
      font-size: 1.1em;
    }

    .order-details {
      margin-top: 30px;
    }

    .details-section {
      margin: 20px 0;
    }

    .order-items {
      margin: 15px 0;
    }

    .order-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .item-image {
      flex: 0 0 60px;
      margin-right: 15px;
    }

    .item-image img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }

    .item-details {
      flex: 1;
    }

    .item-details h5 {
      margin: 0 0 5px;
    }

    .item-details p {
      margin: 3px 0;
    }

    .item-total {
      font-weight: bold;
      margin-left: 15px;
    }

    .totals {
      margin-top: 30px;
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }

    .grand-total {
      font-weight: bold;
      font-size: 1.2em;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }

    .loading-order {
      text-align: center;
      padding: 30px;
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
    }
  `]
})
export class OrderCompleteComponent implements OnInit {
  order: Order | undefined;
  
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      if (orderId) {
        this.orderService.getOrderById(orderId).subscribe(order => {
          if (order) {
            this.order = order;
          } else {
            // Order not found
            this.router.navigate(['/']);
          }
        });
      } else {
        // No order ID provided
        this.router.navigate(['/']);
      }
    });
  }
  
  getSubtotal(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  }
  
  getShippingCost(): number {
    if (!this.order) return 0;
    return this.order.totalAmount - this.getSubtotal();
  }
} 