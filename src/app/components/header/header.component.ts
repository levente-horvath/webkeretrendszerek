import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span routerLink="/" style="cursor: pointer">Lakás Dekoráció</span>
      <span class="spacer"></span>
      <button mat-icon-button routerLink="/cart">
        <mat-icon [matBadge]="cartItemCount" matBadgeColor="accent" [matBadgeHidden]="cartItemCount === 0">shopping_cart</mat-icon>
      </button>
      <button mat-icon-button routerLink="/profile">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  private cartSubscription: Subscription | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
