import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Regisztráció</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Teljes név</mat-label>
                <input matInput formControlName="displayName" required>
                <mat-error *ngIf="registerForm.get('displayName')?.hasError('required')">
                  Név megadása kötelező
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" required>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                  Email cím megadása kötelező
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                  Érvénytelen email cím
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Telefonszám</mat-label>
                <input matInput formControlName="phoneNumber">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Jelszó</mat-label>
                <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" required>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                  Jelszó megadása kötelező
                </mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                  A jelszónak legalább 6 karakter hosszúnak kell lennie
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Jelszó megerősítése</mat-label>
                <input matInput formControlName="confirmPassword" [type]="hidePassword ? 'password' : 'text'" required>
                <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                  Jelszó megerősítése kötelező
                </mat-error>
                <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">
                  A jelszavak nem egyeznek
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="register-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading">
                <span *ngIf="!isLoading">Regisztráció</span>
                <mat-icon *ngIf="isLoading">sync</mat-icon>
              </button>
            </div>
          </form>
        </mat-card-content>
        
        <mat-divider></mat-divider>
        
        <mat-card-actions>
          <div class="login-prompt">
            <p>Már van fiókja?</p>
            <a [routerLink]="['/login']" mat-button color="accent">Bejelentkezés</a>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }
    
    .register-card {
      max-width: 500px;
      width: 100%;
    }
    
    .form-row {
      width: 100%;
      margin-bottom: 16px;
    }
    
    mat-form-field {
      width: 100%;
    }
    
    .register-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    .login-prompt {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
    }
    
    @media (max-width: 599px) {
      .register-container {
        padding: 20px 16px;
      }
      
      .register-card {
        width: 100%;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    const { email, password } = this.registerForm.value;
    
    this.authService.register(email, password).subscribe({
      next: () => {
        this.snackBar.open('Sikeres regisztráció!', 'Bezár', {
          duration: 3000
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'Sikertelen regisztráció';
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'Ez az email cím már regisztrálva van';
        }
        
        this.snackBar.open(errorMessage, 'Bezár', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
} 