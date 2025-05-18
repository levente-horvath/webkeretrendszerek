import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CategorySidebarComponent } from '../category-sidebar/category-sidebar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    CategorySidebarComponent
  ],
  template: `
    <div class="admin-container">
      <mat-card class="admin-card">
        <mat-card-header>
          <mat-card-title>Termék kezelés</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
            <mat-form-field>
              <mat-label>Termék neve</mat-label>
              <input matInput formControlName="name" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Leírás</mat-label>
              <textarea matInput formControlName="description" required></textarea>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Ár</mat-label>
              <input matInput type="number" formControlName="price" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Kép URL</mat-label>
              <input matInput formControlName="imageUrl" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Kategória</mat-label>
              <mat-select formControlName="category" required>
                <mat-option *ngFor="let category of categories" [value]="category.id">
                  {{ category.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Készlet</mat-label>
              <input matInput type="number" formControlName="stock" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Értékelés</mat-label>
              <input matInput type="number" formControlName="rating" min="0" max="5" step="0.1" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Méret (szélesség)</mat-label>
              <input matInput type="number" formControlName="width" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Méret (magasság)</mat-label>
              <input matInput type="number" formControlName="height" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Méret (mélység)</mat-label>
              <input matInput type="number" formControlName="depth" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Anyag</mat-label>
              <input matInput formControlName="material" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Szín</mat-label>
              <input matInput formControlName="color" required>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
                {{ editingProduct ? 'Frissítés' : 'Hozzáadás' }}
              </button>
              <button mat-button type="button" (click)="resetForm()">Törlés</button>
            </div>
          </form>

          <table mat-table [dataSource]="products" class="product-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Kép</th>
              <td mat-cell *matCellDef="let product">
                <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Név</th>
              <td mat-cell *matCellDef="let product">{{ product.name }}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Ár</th>
              <td mat-cell *matCellDef="let product">{{ product.price | currency:'HUF':'symbol-narrow':'1.0-0' }}</td>
            </ng-container>

            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>Készlet</th>
              <td mat-cell *matCellDef="let product">{{ product.stock }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Műveletek</th>
              <td mat-cell *matCellDef="let product">
                <button mat-icon-button color="primary" (click)="editProduct(product)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteProduct(product)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-card {
      margin-bottom: 20px;
    }

    .product-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .product-table {
      width: 100%;
      margin-top: 24px;
    }

    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    mat-form-field {
      width: 100%;
    }

    textarea {
      min-height: 100px;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  editingProduct: Product | null = null;
  displayedColumns: string[] = ['image', 'name', 'price', 'stock', 'actions'];
  categories = [
    { id: 'wall-decor', name: 'Fali dekoráció' },
    { id: 'soft-furnishings', name: 'Lakástextil' },
    { id: 'home-accents', name: 'Otthoni kiegészítők' },
    { id: 'storage', name: 'Tárolás' },
    { id: 'living-room', name: 'Nappali' },
    { id: 'bedroom', name: 'Hálószoba' },
    { id: 'kitchen', name: 'Konyha' },
    { id: 'bathroom', name: 'Fürdőszoba' },
    { id: 'office', name: 'Iroda' },
    { id: 'outdoor', name: 'Kültéri' }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      width: [0, [Validators.required, Validators.min(0)]],
      height: [0, [Validators.required, Validators.min(0)]],
      depth: [0, [Validators.required, Validators.min(0)]],
      material: ['', Validators.required],
      color: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is admin
    this.authService.isAdmin().subscribe((isAdmin: boolean) => {
      if (!isAdmin) {
        this.snackBar.open('Nincs jogosultsága az admin felülethez!', 'Bezárás', { duration: 3000 });
        this.router.navigate(['/']);
      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData = {
        name: formValue.name,
        description: formValue.description,
        price: Number(formValue.price),
        imageUrl: formValue.imageUrl,
        category: formValue.category,
        stock: Number(formValue.stock),
        rating: Number(formValue.rating),
        dimensions: {
          width: Number(formValue.width),
          height: Number(formValue.height),
          depth: Number(formValue.depth)
        },
        material: formValue.material,
        color: formValue.color,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (this.editingProduct) {
        this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
          next: () => {
            this.snackBar.open('Termék sikeresen frissítve!', 'Bezárás', { duration: 3000 });
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            this.snackBar.open('Hiba történt a frissítés során!', 'Bezárás', { duration: 3000 });
            console.error('Error updating product:', error);
          }
        });
      } else {
        this.productService.addProduct(productData).subscribe({
          next: () => {
            this.snackBar.open('Termék sikeresen hozzáadva!', 'Bezárás', { duration: 3000 });
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            this.snackBar.open('Hiba történt a hozzáadás során!', 'Bezárás', { duration: 3000 });
            console.error('Error adding product:', error);
          }
        });
      }
    }
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock,
      rating: product.rating,
      width: product.dimensions.width,
      height: product.dimensions.height,
      depth: product.dimensions.depth,
      material: product.material,
      color: product.color
    });
  }

  deleteProduct(product: Product): void {
    if (confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.snackBar.open('Termék sikeresen törölve!', 'Bezárás', { duration: 3000 });
          this.loadProducts();
        },
        error: (error) => {
          this.snackBar.open('Hiba történt a törlés során!', 'Bezárás', { duration: 3000 });
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.editingProduct = null;
  }
} 