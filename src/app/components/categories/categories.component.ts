import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryProducts: any;
  searchWord: string = '';
  /* If category has no sub categories */
  isCatEmpty: boolean = false;
  /* For pagination */
  page: number = 0;

  constructor(private _ProductService: ProductsService, private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.spinner.show();
  }


  ngOnInit(): void {
    this.routeParameters();
  }

  /* Find if there's any parameters to use them in Showing subcategories */
  routeParameters(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      if (param.get('category')) {
        this.spinner.show();
        this.getCatProducts(param.get('category')!)
      }
    })
  }

  /* Get Category's products */
  getCatProducts(categoryId: string): void {
    this.page = 0;
    this._ProductService.getProducts(`?category=${categoryId}`).subscribe({
      next: response => {
        this.categoryProducts = response.data;
        this.spinner.hide();
      },
      error: err => {
        this.spinner.hide();
        this.toastr.error(err.error.message || err.statusText, `Categories  ` + (err.error.statusMsg || err.name));
      }
    })

  }


  /* get The search word */
  getSearchWord(): void {
    this._AuthService.searchWord.subscribe(response => {
      this.searchWord = response;
    })
  }
}


