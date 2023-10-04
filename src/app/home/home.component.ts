import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';

import { error } from 'jquery';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  allProductss: any;
  constructor(
    private _ProductService: ProductsService,
    private _CartService: CartService
  ) { }
  homeCartData: any;
  ngOnInit(): void {
    this._ProductService.allProducts.subscribe({
      next: (response) => {
        this.allProductss = response;
      },
    });

    if (!this.allProductss.length) {
      this._ProductService.getProducts().subscribe({
        next: (response) => {
          this.allProductss = response.data;
          this._ProductService.getProducts(`?page=2`).subscribe({
            next: (response) => {
              this.allProductss.push(...response.data);
              this._ProductService.allProducts.next(this.allProductss);
            },
          });
        },
        error: (err) => console.log(err),
      });
    }
  }
  addItem(id: string, event: Event): void {
    this._ProductService.addItem(id, event);
  }
  removeItem(id: string, event: Event): void {
    this._ProductService.removeItem(id, event);
  }
  addToCart(productId: string): void {
    this._CartService.addToCart(productId).subscribe({
      next: (response) => {
        this.homeCartData = response.data;
      },
      error: (err) => console.log(err),
    });
  }
}
