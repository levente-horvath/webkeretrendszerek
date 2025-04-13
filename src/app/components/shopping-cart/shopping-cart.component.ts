import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CurrencyFormatPipe
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Bevásárlókosár</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="cartItems" *ngIf="cartItems.length > 0">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Kép</th>
            <td mat-cell *matCellDef="let item">
              <img [src]="item.product.imageUrl" [alt]="item.product.name" class="product-image">
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Termék</th>
            <td mat-cell *matCellDef="let item">{{ item.product.name }}</td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Ár</th>
            <td mat-cell *matCellDef="let item">{{ item.product.price | currencyFormat }}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Mennyiség</th>
            <td mat-cell *matCellDef="let item">
              <button mat-icon-button (click)="decreaseQuantity(item)">
                <mat-icon>remove</mat-icon>
              </button>
              {{ item.quantity }}
              <button mat-icon-button (click)="increaseQuantity(item)">
                <mat-icon>add</mat-icon>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Összesen</th>
            <td mat-cell *matCellDef="let item">{{ item.product.price * item.quantity | currencyFormat }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let item">
              <button mat-icon-button color="warn" (click)="removeItem(item)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="empty-cart" *ngIf="cartItems.length === 0">
          <mat-icon>shopping_cart</mat-icon>
          <p>Az Ön kosara üres</p>
          <button mat-raised-button color="primary" routerLink="/">Vásárlás folytatása</button>
        </div>
      </mat-card-content>

      <mat-card-actions *ngIf="cartItems.length > 0">
        <div class="cart-summary">
          <p class="total">Végösszeg: {{ total | currencyFormat }}</p>
          <div class="actions">
            <button mat-button routerLink="/">Vásárlás folytatása</button>
            <button mat-raised-button color="primary" routerLink="/checkout">
              Tovább a pénztárhoz
            </button>
          </div>
        </div>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    mat-card {
      margin: 20px;
    }

    table {
      width: 100%;
    }

    .empty-cart {
      text-align: center;
      padding: 40px;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }

    .cart-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;

      .total {
        font-size: 1.2em;
        font-weight: bold;
      }

      .actions {
        button {
          margin-left: 8px;
        }
      }
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppingCartComponent implements OnInit {
  displayedColumns: string[] = ['image', 'name', 'price', 'quantity', 'total', 'actions'];
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
