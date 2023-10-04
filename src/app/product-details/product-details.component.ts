import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  constructor(private _ProductService: ProductsService, private _ActivatedRoute: ActivatedRoute) { }
  productDetails: any;
  id: any;
  seeMore: boolean = false;
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => { this.id = params.get('id') })
    this._ProductService.allProducts.subscribe({
      next: (response) => {
        if (response.length) {
          this.findProductDetails(response, this.id)

        } else (this.getProductDetails(this.id))
      }
    })
  }
  getProductDetails(id: string): void {

    this._ProductService.getProductDetails(id).subscribe({
      next: (response) => {
        this.productDetails = response.data;
      },
      error: (err) => console.log(err)
    })
  }
  findProductDetails(products: any[], id: string) {

    this.productDetails = (products.filter((product) => product['_id'] == id))[0];

  }
  addItem(id: string, event: Event): void {
    this._ProductService.addItem(id, event);
  }
  removeItem(id: string, event: Event): void {
    this._ProductService.removeItem(id, event);
  }
  seeMoreFn() {
    this.seeMore = true;
    console.log(this.seeMore);

  }
  seeLessFn() {
    this.seeMore = false
    console.log(this.seeMore);
  }
}
