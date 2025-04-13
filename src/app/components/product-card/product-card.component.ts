import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CurrencyFormatPipe
  ],
  template: `
    <mat-card class="product-card">
      <img mat-card-image [src]="product.imageUrl" [alt]="product.name">
      <mat-card-content>
        <mat-card-title>{{ product.name }}</mat-card-title>
        <mat-card-subtitle>{{ product.price | currencyFormat }}</mat-card-subtitle>
        <p class="description">{{ product.description }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button [routerLink]="['/product', product.id]">RÉSZLETEK</button>
        <button mat-raised-button color="primary" (click)="addToCart.emit(product)">
          <mat-icon>add_shopping_cart</mat-icon>
          KOSÁRBA
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .product-card {
      max-width: 300px;
      margin: 16px;
    }
    img {
      height: 200px;
      object-fit: cover;
    }
    .description {
      margin: 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}
