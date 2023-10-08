import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-categories-slider',
  templateUrl: './categories-slider.component.html',
  styleUrls: ['./categories-slider.component.css'],
})
export class CategoriesSliderComponent implements OnInit {
  allCategories: any;
  constructor(private _ProductService: ProductsService) { }
  ngOnInit(): void {
    this.getCategories();
  }
  getCategories(): void {
    this._ProductService.getCategories().subscribe({
      next: (response) => {
        this.allCategories = response.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      1200: {
        items: 5,
      },
      1400: {
        items: 6,
      },
    },
    nav: true,
  };
}
