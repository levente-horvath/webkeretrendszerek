import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule
  ],
  template: `
    <mat-card class="profile-card">
      <mat-card-header>
        <mat-card-title>Saját profil</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <mat-tab-group>
          <mat-tab label="Profil adatok">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="form-section">
                <h3>Személyes adatok</h3>
                
                <mat-form-field appearance="outline">
                  <mat-label>Megjelenítendő név</mat-label>
                  <input matInput formControlName="displayName">
                  <mat-error *ngIf="profileForm.get('displayName')?.hasError('required')">
                    A név megadása kötelező
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email">
                  <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                    Az email megadása kötelező
                  </mat-error>
                  <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                    Kérjük, adjon meg egy érvényes email címet
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Telefonszám</mat-label>
                  <input matInput formControlName="phoneNumber">
                  <mat-error *ngIf="profileForm.get('phoneNumber')?.hasError('required')">
                    A telefonszám megadása kötelező
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>

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
                <button mat-raised-button color="primary" type="submit" [disabled]="!profileForm.valid">
                  Mentés
                </button>
              </div>
            </form>
          </mat-tab>

          <mat-tab label="Rendelés előzmények">
            <p class="placeholder-text">Még nincs megvalósítva</p>
          </mat-tab>

          <mat-tab label="Kívánságlista">
            <p class="placeholder-text">Még nincs megvalósítva</p>
          </mat-tab>
        </mat-tab-group>
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
  `]
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Mock user data until we implement Firebase
    const user: User = {
      id: '1',
      email: 'user@example.com',
      displayName: 'John Doe',
      phoneNumber: '+36201234567',
      address: {
        street: '123 Main St',
        city: 'Budapest',
        state: 'Budapest',
        postalCode: '1000',
        country: 'Hungary'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      wishlist: [],
      orderHistory: []
    };

    this.profileForm = this.fb.group({
      displayName: [user.displayName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      phoneNumber: [user.phoneNumber, Validators.required],
      address: this.fb.group({
        street: [user.address.street, Validators.required],
        city: [user.address.city, Validators.required],
        state: [user.address.state, Validators.required],
        postalCode: [user.address.postalCode, Validators.required],
        country: [user.address.country, Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      // This will be implemented with a service later
    }
  }
}
