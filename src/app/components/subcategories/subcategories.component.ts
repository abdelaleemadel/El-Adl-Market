import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit {
  subCategories: any;
  subProducts: any;
  searchWord: string = '';
  isCatEmpty: boolean = false;
  isProducts: boolean = false;
  page: number = 0;
  constructor(private _ProductService: ProductsService, private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.spinner.show();
  }
  ngOnInit(): void {
    this.routeParameters();
  }

  /* Find if there's any parameters to use them in Showing subcategories */
  routeParameters(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      if (param.get('category')) {
        /* Dispaly subcategories in that category */
        this.isProducts = false;
        this.getCatSubcategories(param.get('category')!)
      } else if (param.get('subcategory')) {
        /* Display products of that Subcategory */
        this.isProducts = true;
        this.getSubCatProducts(param.get('subcategory')!);
      }
      else {
        /* Display All sub cateogries */
        this.isProducts = false;
        this.getSubCategories();
      }
    })
  }

  /*Call the API and display all the sub categories  */
  getSubCategories(): void {
    this._ProductService.getSubCategories().subscribe({
      next: response => {
        this.subCategories = response.data;
        this.spinner.hide()
        this._ProductService.getSubCategories('?page=2').subscribe({
          next: response => {
            this.subCategories.push(...response.data);
          },
          error: err => { this.toastr.error(`${err.error.message.split(' ').slice(0, 4).join(' ') || err.statusText}`, `SubCategories  ${err.error.statusMsg || err.name}`); }

        })
      },
      error: err => this.afterError(err)
    })
  }

  /* Get Sub-Category's products */
  getSubCatProducts(subCategoryId: string): void {
    this._ProductService.getProducts(`?subcategory=${subCategoryId}`).subscribe({
      next: response => {
        this.subProducts = response.data;
        this.spinner.hide();
      },
      error: err => {
        this.afterError(err)
      }
    })
  }

  /* Get Category's SubCategories */
  getCatSubcategories(categoryId: string): void {
    this._ProductService.getCategories(`/${categoryId}/subcategories`).subscribe({
      next: response => {
        if (response.results == 0) {
          this.isCatEmpty = true;
        } else {
          this.subCategories = response.data;
          this.isCatEmpty = false;
        }
        this.spinner.hide();
      },
      error: err => this.afterError(err)
    })
  }
  /* Actions after Error from Api */
  afterError(err: any): void {
    this.spinner.hide();
    this.toastr.error(`${err.error.message?.split(' ').slice(0, 4).join(' ') || err.statusText}`, `SubCategories  ${err.error.statusMsg || err.name}`);
  }
}


