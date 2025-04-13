import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { CategorySidebarComponent } from './components/category-sidebar/category-sidebar.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductListComponent,
    ProductCardComponent,
    ProductDetailsComponent,
    ShoppingCartComponent,
    CheckoutFormComponent,
    CategorySidebarComponent,
    UserProfileComponent,
    CurrencyFormatPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 