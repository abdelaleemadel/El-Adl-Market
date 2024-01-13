import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth.guard';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { AddressComponent } from './components/address/address.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PasswordComponent } from './components/password/password.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productDetails', component: ProductDetailsComponent },
  { path: 'cart', canActivate: [authGuard], component: CartComponent },
  { path: 'address', canActivate: [authGuard], component: AddressComponent },
  { path: 'allorders', canActivate: [authGuard], component: OrdersComponent },
  { path: 'forgetPassword', component: PasswordComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'subcategories', component: SubcategoriesComponent },
  { path: 'wishlist', canActivate: [authGuard], component: WishlistComponent },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
