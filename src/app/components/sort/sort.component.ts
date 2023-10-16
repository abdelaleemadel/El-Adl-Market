import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit {
  constructor(private _ProductsService: ProductsService) { }
  minPrice: number = 0;
  maxPrice: number = 50000;
  sort: string = 'sold';
  ngOnInit(): void {
  }
  priceValue(): void {
    this._ProductsService.minPrice.next(this.minPrice);
    this._ProductsService.maxPrice.next(this.maxPrice);
  }
  sortValue(): void {
    this._ProductsService.sort.next(this.sort)
  }
}
