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
import { BrandsComponent } from './components/brands/brands.component';
import { PasswordComponent } from './components/password/password.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productDetails/:id', component: ProductDetailsComponent },
  { path: 'cart', canActivate: [authGuard], component: CartComponent },
  { path: 'address', canActivate: [authGuard], component: AddressComponent },
  { path: 'allorders', canActivate: [authGuard], component: OrdersComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'forgetPassword', component: PasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
