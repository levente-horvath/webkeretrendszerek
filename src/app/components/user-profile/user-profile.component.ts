import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-card class="profile-card">
      <mat-card-header>
        <mat-card-title>Cím adatok</mat-card-title>
        <span class="spacer"></span>
        <div *ngIf="!isOnline" class="offline-indicator">
          <span class="offline-badge">Offline mód</span>
        </div>
        <button mat-raised-button color="warn" (click)="onLogout()">
          <mat-icon>exit_to_app</mat-icon>
          Kijelentkezés
        </button>
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
        
        <form *ngIf="!isLoading" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3>Cím adatok</h3>
            
            <div formGroupName="address">
              <mat-form-field appearance="outline">
                <mat-label>Utca, házszám</mat-label>
                <input matInput formControlName="street">
                <mat-error *ngIf="profileForm.get('address.street')?.hasError('required')">
                  Az utca és házszám megadása kötelező
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Város</mat-label>
                <input matInput formControlName="city">
                <mat-error *ngIf="profileForm.get('address.city')?.hasError('required')">
                  A város megadása kötelező
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Megye</mat-label>
                <input matInput formControlName="state">
                <mat-error *ngIf="profileForm.get('address.state')?.hasError('required')">
                  A megye megadása kötelező
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Irányítószám</mat-label>
                <input matInput formControlName="postalCode">
                <mat-error *ngIf="profileForm.get('address.postalCode')?.hasError('required')">
                  Az irányítószám megadása kötelező
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ország</mat-label>
                <input matInput formControlName="country">
                <mat-error *ngIf="profileForm.get('address.country')?.hasError('required')">
                  Az ország megadása kötelező
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <div class="form-actions">
            <div *ngIf="!isOnline" class="offline-warning">
              <mat-icon color="warn">cloud_off</mat-icon>
              <span>Offline módban a változtatások lokálisan lesznek mentve</span>
            </div>
            <button mat-raised-button color="primary" type="submit" 
              [disabled]="!profileForm.valid || isSubmitting || !profileForm.dirty">
              <span *ngIf="!isSubmitting">Mentés</span>
              <mat-spinner *ngIf="isSubmitting" diameter="24"></mat-spinner>
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .profile-card {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    .form-section {
      padding: 20px 0;

      h3 {
        margin-bottom: 20px;
      }
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      margin-top: 20px;
      text-align: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    mat-divider {
      margin: 20px 0;
    }

    .placeholder-text {
      padding: 20px;
      text-align: center;
      color: #666;
    }

    mat-tab-group {
      margin-top: 20px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }
    
    mat-card-header {
      display: flex;
      align-items: center;
    }
    
    .offline-indicator {
      margin-right: 16px;
    }
    
    .offline-warning {
      display: flex;
      align-items: center;
      color: #f44336;
      font-size: 14px;
      
      mat-icon {
        margin-right: 8px;
      }
    }
    
    .editable-section-hint {
      color: #2196F3;
      font-style: italic;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
    }
  `]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  isOnline = navigator.onLine;
  currentUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    // Check for network status
    this.isOnline = navigator.onLine;
    
    // Initialize form with default or saved values
    this.loadUserData();
    
    // Add event listeners for online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.snackBar.open('Kapcsolat helyreállt!', 'Bezár', { duration: 3000 });
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.snackBar.open('Nincs internetkapcsolat! Lokális módban dolgozhat.', 'Bezár', { duration: 3000 });
    });
  }
  
  private initForm(user: User) {
    this.profileForm = this.fb.group({
      address: this.fb.group({
        street: [user.address.street, Validators.required],
        city: [user.address.city, Validators.required],
        state: [user.address.state, Validators.required],
        postalCode: [user.address.postalCode, Validators.required],
        country: [user.address.country, Validators.required]
      })
    });
  }
  
  private loadUserData() {
    // Default address values
    let defaultAddress = {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Hungary'
    };
    
    // Try to load saved address from localStorage
    try {
      const userAddressKey = 'user_address_data';
      const savedAddress = localStorage.getItem(userAddressKey);
      
      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);
        defaultAddress = {
          ...defaultAddress,
          ...parsedAddress
        };
        console.log('Loaded address data from local storage');
      }
    } catch (error) {
      console.error('Error loading address from local storage:', error);
    }
    
    const defaultUser = {
      id: this.currentUserId || '',
      email: '',
      displayName: '',
      phoneNumber: '',
      address: defaultAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
      wishlist: [],
      orderHistory: [],
      isAdmin: true
    };
    
    this.initForm(defaultUser);
    this.isLoading = false;
  }

  onSubmit() {
    if (!this.profileForm.valid) {
      return;
    }
    
    this.isSubmitting = true;
    
    // Get form values and save only locally, not to Firebase
    const formValues = this.profileForm.getRawValue();
    
    // Save the updated address to local storage
    try {
      const userAddressKey = 'user_address_data';
      localStorage.setItem(userAddressKey, JSON.stringify(formValues.address));
      
      this.snackBar.open('Cím adatok sikeresen mentve lokálisan', 'Bezár', {
        duration: 3000
      });
      
      this.profileForm.markAsPristine();
    } catch (error) {
      console.error('Error saving address data to local storage:', error);
      this.snackBar.open('Hiba történt a címadatok mentésekor', 'Bezár', {
        duration: 5000
      });
    }
    
    this.isSubmitting = false;
  }
  
  onLogout() {
    // Simply navigate to home page
    this.router.navigate(['/']);
    this.snackBar.open('Kijelentkezve', 'Bezár', { 
      duration: 3000 
    });
  }

  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.removeEventListener('offline', () => {
      this.isOnline = false;
    });
  }
}
