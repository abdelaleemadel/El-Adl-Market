import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-category-slider',
  templateUrl: './category-slider.component.html',
  styleUrls: ['./category-slider.component.css']
})
export class CategorySliderComponent implements OnInit {

  allCategories: any;
  constructor(private _ProductService: ProductsService,
    private _AuthService: AuthService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.spinner.show('slider');
  }
  ngOnInit(): void {
    this.getCategories();
  }

  /* Call the API and display the categories */
  getCategories(): void {
    this._ProductService.getCategories().subscribe({
      next: (response) => {
        this.allCategories = response.data.reverse();
        this.spinner.hide('slider');
      },
      error: (err) => {
        console.log(err);

        this.spinner.hide('slider');
        this.toastr.error(`${err.error.message || err.statusText}`, `Categories ${err.error.statusMsg || err.name}`);
      },
    });
  }

  /* OWL Carsoul */
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
