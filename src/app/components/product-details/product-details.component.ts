import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { Product } from '../../models/product.interface';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CurrencyFormatPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="product-details" *ngIf="product">
      <mat-card class="product-image-card">
        <img [src]="product.imageUrl" [alt]="product.name">
      </mat-card>

      <mat-card class="product-info-card">
        <mat-card-header>
          <mat-card-title>{{ product.name }}</mat-card-title>
          <mat-card-subtitle>{{ product.price | currencyFormat }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p class="description">{{ product.description }}</p>
          
          <mat-divider></mat-divider>
          
          <div class="product-meta">
            <h3>Termék részletei</h3>
            <p><strong>Anyag:</strong> {{ product.material }}</p>
            <p><strong>Szín:</strong> {{ product.color }}</p>
            <p><strong>Méretek:</strong> {{ product.dimensions.width }}x{{ product.dimensions.height }}x{{ product.dimensions.depth }} cm</p>
            <p><strong>Készlet:</strong> {{ product.stock }} darab elérhető</p>
            <p>
              <strong>Értékelés:</strong>
              <span class="rating">
                <mat-icon *ngFor="let star of getStars(product.rating)">star</mat-icon>
                <mat-icon *ngFor="let star of getHalfStars(product.rating)">star_half</mat-icon>
                <mat-icon *ngFor="let star of getEmptyStars(product.rating)">star_border</mat-icon>
              </span>
              ({{ product.rating }})
            </p>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button 
            mat-raised-button 
            color="primary" 
            [disabled]="product.stock === 0"
            (click)="addToCart()">
            <mat-icon>add_shopping_cart</mat-icon>
            {{ product.stock === 0 ? 'ELFOGYOTT' : 'KOSÁRBA' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .product-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .product-image-card {
      img {
        width: 100%;
        height: auto;
        object-fit: cover;
      }
    }

    .product-info-card {
      .description {
        font-size: 1.1em;
        line-height: 1.6;
        margin: 16px 0;
      }

      mat-divider {
        margin: 24px 0;
      }

      .product-meta {
        h3 {
          margin-bottom: 16px;
        }

        p {
          margin: 8px 0;
        }
      }

      .rating {
        color: #ffd700;
        margin-left: 8px;
        
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    @media (max-width: 768px) {
      .product-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.productService.getProductById(productId).subscribe(product => {
          if (product) {
            this.product = product;
          } else {
            // Product not found, redirect to home
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getHalfStars(rating: number): number[] {
    return rating % 1 >= 0.5 ? [0] : [];
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.ceil(rating)).fill(0);
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }
}
