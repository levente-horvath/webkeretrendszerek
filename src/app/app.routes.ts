import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutFormComponent },
  { path: 'order-complete/:id', component: OrderCompleteComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: '**', redirectTo: '' }
];
