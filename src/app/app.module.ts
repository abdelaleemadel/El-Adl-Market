import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { StartsPipe } from './pipes/starts.pipe';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CategoriesComponent } from './components/categories/categories.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CartComponent } from './components/cart/cart.component';
import { AddressComponent } from './components/address/address.component';
import { OrdersComponent } from './components/orders/orders.component';
import { DatePipe } from './pipes/date.pipe';
import { BrandsComponent } from './components/brands/brands.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PasswordComponent } from './components/password/password.component';
import { SearchPipe } from './pipes/search.pipe';
import { NgxSpinnerModule } from "ngx-spinner";
import { CategorySliderComponent } from './components/category-slider/category-slider.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    StartsPipe,
    ProductDetailsComponent,
    CategoriesComponent,
    CartComponent,
    AddressComponent,
    OrdersComponent,
    DatePipe,
    BrandsComponent,
    PasswordComponent,
    SearchPipe,
    CategorySliderComponent,
    SubcategoriesComponent,
    WishlistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, CarouselModule, NgxPaginationModule, NgxSpinnerModule, ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
