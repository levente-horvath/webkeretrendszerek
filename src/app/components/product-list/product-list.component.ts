import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.interface';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ProductCardComponent],
  template: `
    <div class="product-list-header" *ngIf="categoryId">
      <h2>{{ getCategoryName() }}</h2>
    </div>
    <div class="product-grid">
      <app-product-card
        *ngFor="let product of filteredProducts"
        [product]="product"
        (addToCart)="onAddToCart($event)"
      ></app-product-card>
      
      <div *ngIf="filteredProducts.length === 0" class="no-products">
        <h3>Ebben a kategóriában nincsenek termékek</h3>
        <p>Próbáljon meg egy másik kategóriát, vagy nézzen vissza később.</p>
      </div>
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .product-list-header {
      padding: 0 16px;
      margin-bottom: 8px;
    }

    .no-products {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    @media (max-width: 600px) {
      .product-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductListComponent implements OnInit {
  categoryId: string | null = null;
  filteredProducts: Product[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      this.loadProducts();
    });
  }

  loadProducts() {
    if (!this.categoryId || this.categoryId === 'all') {
      this.productService.getProducts().subscribe(products => {
        this.filteredProducts = products;
      });
    } else {
      this.productService.getProductsByCategory(this.categoryId).subscribe(products => {
        this.filteredProducts = products;
      });
    }
  }

  getCategoryName(): string {
    if (!this.categoryId) return 'Összes termék';
    
    // Map category IDs to display names
    const categoryNames: {[key: string]: string} = {
      'all': 'Összes termék',
      'wall-decor': 'Fali dekoráció',
      'soft-furnishings': 'Lakástextil',
      'home-accents': 'Otthoni kiegészítők',
      'storage': 'Tárolás',
      'living-room': 'Nappali',
      'bedroom': 'Hálószoba',
      'kitchen': 'Konyha',
      'bathroom': 'Fürdőszoba',
      'office': 'Iroda',
      'outdoor': 'Kültéri'
    };
    
    return categoryNames[this.categoryId] || this.categoryId;
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
