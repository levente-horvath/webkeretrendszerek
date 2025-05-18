import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.interface';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    CurrencyFormatPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  template: `
    <div class="checkout-container">
      <h1>Megrendelés</h1>
      
      <mat-stepper [linear]="true" #stepper>
        <mat-step [stepControl]="personalInfoForm">
          <ng-template matStepLabel>Személyes adatok</ng-template>
          <form [formGroup]="personalInfoForm">
            <div class="form-fields">
              <mat-form-field appearance="outline">
                <mat-label>Teljes név</mat-label>
                <input matInput formControlName="fullName" required>
                <mat-error *ngIf="personalInfoForm.get('fullName')?.hasError('required')">
                  A név megadása kötelező
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Email cím</mat-label>
                <input matInput formControlName="email" type="email" required>
                <mat-error *ngIf="personalInfoForm.get('email')?.hasError('required')">
                  Az email megadása kötelező
                </mat-error>
                <mat-error *ngIf="personalInfoForm.get('email')?.hasError('email')">
                  Kérjük, adjon meg egy érvényes e-mail címet
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Telefonszám</mat-label>
                <input matInput formControlName="phone" required>
                <mat-error *ngIf="personalInfoForm.get('phone')?.hasError('required')">
                  A telefonszám megadása kötelező
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" matStepperNext [disabled]="personalInfoForm.invalid">
                Tovább
              </button>
            </div>
          </form>
        </mat-step>
        
        <mat-step [stepControl]="shippingAddressForm">
          <ng-template matStepLabel>Szállítási cím</ng-template>
          <form [formGroup]="shippingAddressForm">
            <div class="form-fields">
              <mat-form-field appearance="outline">
                <mat-label>Utca, házszám</mat-label>
                <input matInput formControlName="street" required>
                <mat-error *ngIf="shippingAddressForm.get('street')?.hasError('required')">
                  Az utca és házszám megadása kötelező
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Város</mat-label>
                <input matInput formControlName="city" required>
                <mat-error *ngIf="shippingAddressForm.get('city')?.hasError('required')">
                  A város megadása kötelező
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Irányítószám</mat-label>
                <input matInput formControlName="postalCode" required>
                <mat-error *ngIf="shippingAddressForm.get('postalCode')?.hasError('required')">
                  Az irányítószám megadása kötelező
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-button matStepperPrevious>Vissza</button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="shippingAddressForm.invalid">
                Tovább
              </button>
            </div>
          </form>
        </mat-step>
        
        <mat-step>
          <ng-template matStepLabel>Rendelés áttekintése</ng-template>
          
          <div *ngIf="cartItems.length > 0; else emptyCart">
            <div class="review-section">
              <h3>Vásárló adatai</h3>
              <p><strong>Név:</strong> {{ personalInfoForm.get('fullName')?.value }}</p>
              <p><strong>Email:</strong> {{ personalInfoForm.get('email')?.value }}</p>
              <p><strong>Telefon:</strong> {{ personalInfoForm.get('phone')?.value }}</p>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="review-section">
              <h3>Szállítási cím</h3>
              <p>
                {{ shippingAddressForm.get('street')?.value }}, 
                {{ shippingAddressForm.get('city')?.value }}, 
                {{ shippingAddressForm.get('postalCode')?.value }}
              </p>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="review-section">
              <h3>Rendelés összesítése</h3>
              <div class="cart-items">
                <div class="cart-item" *ngFor="let item of cartItems">
                  <div class="item-image">
                    <img [src]="item.product.imageUrl" [alt]="item.product.name">
                  </div>
                  <div class="item-details">
                    <h4>{{ item.product.name }}</h4>
                    <p>{{ item.product.price | currencyFormat }} × {{ item.quantity }}</p>
                  </div>
                  <div class="item-total">
                    {{ item.product.price * item.quantity | currencyFormat }}
                  </div>
                </div>
              </div>
              
              <div class="cart-summary">
                <div class="summary-line">
                  <span>Részösszeg:</span>
                  <span>{{ cartService.getCartTotal() | currencyFormat }}</span>
                </div>
                <div class="summary-line">
                  <span>Szállítási díj:</span>
                  <span>{{ shippingCost | currencyFormat }}</span>
                </div>
                <div class="summary-line total">
                  <span>Végösszeg:</span>
                  <span>{{ cartService.getCartTotal() + shippingCost | currencyFormat }}</span>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button mat-button matStepperPrevious>Vissza</button>
              <button mat-raised-button color="primary" [disabled]="isSubmitting || personalInfoForm.invalid || shippingAddressForm.invalid" (click)="onSubmit()">
                {{ isSubmitting ? 'Feldolgozás...' : 'Megrendelés véglegesítése' }}
              </button>
            </div>
          </div>
          
          <ng-template #emptyCart>
            <div class="empty-cart-message">
              <mat-icon>shopping_cart</mat-icon>
              <h3>Az Ön kosara üres</h3>
              <p>Kérjük, adjon termékeket a kosarához a megrendelés előtt.</p>
              <button mat-raised-button color="primary" routerLink="/">Vásárlás folytatása</button>
            </div>
          </ng-template>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 0 20px;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .review-section {
      margin: 20px 0;
    }
    
    .cart-items {
      margin: 20px 0;
    }
    
    .cart-item {
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
    
    .item-details h4 {
      margin: 0 0 5px;
    }
    
    .item-details p {
      margin: 0;
      color: #666;
    }
    
    .item-total {
      font-weight: bold;
      margin-left: 15px;
    }
    
    .cart-summary {
      margin-top: 20px;
    }
    
    .summary-line {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    
    .total {
      font-weight: bold;
      font-size: 1.2em;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }
    
    .empty-cart-message {
      text-align: center;
      padding: 40px 0;
    }
    
    .empty-cart-message mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #ccc;
    }
  `]
})
export class CheckoutFormComponent implements OnInit {
  personalInfoForm!: FormGroup;
  shippingAddressForm!: FormGroup;
  cartItems: CartItem[] = [];
  shippingCost: number = 1500; // 1500 Ft shipping cost
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
    
    this.shippingAddressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
    
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  onSubmit(): void {
    if (this.personalInfoForm.invalid || this.shippingAddressForm.invalid || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    
    const order: Order = {
      id: '', // Will be set by the service
      customer: {
        fullName: this.personalInfoForm.get('fullName')?.value,
        email: this.personalInfoForm.get('email')?.value,
        phone: this.personalInfoForm.get('phone')?.value
      },
      shipping: {
        street: this.shippingAddressForm.get('street')?.value,
        city: this.shippingAddressForm.get('city')?.value,
        postalCode: this.shippingAddressForm.get('postalCode')?.value
      },
      items: this.cartItems,
      totalAmount: this.cartService.getCartTotal() + this.shippingCost,
      orderDate: new Date(),
      status: 'pending'
    };
    
    this.orderService.placeOrder(order).subscribe(placedOrder => {
      this.snackBar.open('Megrendelését sikeresen rögzítettük!', 'Bezárás', {
        duration: 5000,
        panelClass: 'success-snackbar'
      });
      
      this.cartService.clearCart();
      this.isSubmitting = false;
      this.router.navigate(['/order-complete', placedOrder.id]);
    });
  }
}
