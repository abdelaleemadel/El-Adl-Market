import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  allCategories: any;
  subCategories: any;
  categoryId: string = '';
  searchWord: string = '';
  /* If category has no sub categories */
  isCatEmpty: boolean = false;
  isSlider: boolean = true;
  /* For pagination */
  page: number = 0;

  constructor(private _ProductService: ProductsService, private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService) { }
  ngOnInit(): void {
    /* Check if the component is shown in home (as a slider or not) */
    this._ActivatedRoute.url.subscribe(
      (response) => {
        if (response[0].path == 'home') {
          this.isSlider = true;
        } else if (response[0].path = 'subcategories') {
          this.isSlider = false;
          /* Check if there're parameters  */
          this._ActivatedRoute.paramMap.subscribe((param) => {
            this.getSearchWord();
            if (param.keys.length != 0) {
              this.routeParameters();
            } else {
              this.isCatEmpty = false;
              this.getSubCategories();
            }
          })
        }
      }
    )
    this.getCategories();
  }
  /* Call the API and display the categories */
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
  /*Call the API and display the sub categories  */
  getSubCategories(): void {
    this._ProductService.getSubCategories().subscribe({
      next: response => {
        this.subCategories = response.data;
        this._ProductService.getSubCategories('?page=2').subscribe({
          next: response => {
            this.subCategories.push(...response.data);
          }
        })
      }
    })
  }


  /* Find if there's any parameters to use them in Showing subcategories */
  routeParameters(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      if (param.get('category')) {
        this.categoryId = param.get('category')!;
        this.getSubCatProducts();
      } else {
        this.categoryId = '';
        console.log('empty');
      }
    })
  }
  /* Get subcategory's products */
  getSubCatProducts(): void {
    if (this.categoryId) {
      this._ProductService.getCategories(`/${this.categoryId}/subcategories`).subscribe({
        next: response => {
          if (response.results == 0) {
            this.isCatEmpty = true;
          } else {
            this.subCategories = response.data;
            this.isCatEmpty = false;
          }
        }
      })
    }
  }

  /* get The search word */
  getSearchWord(): void {
    this._AuthService.searchWord.subscribe(response => {
      this.searchWord = response;
    })
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
