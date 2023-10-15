import { Component, OnInit } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { error } from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  page = 0;
  isProducts: boolean = false;
  allBrands: any;
  constructor(private _BrandsService: BrandsService, private _AuthService: AuthService,
    private _ProductsService: ProductsService, private _ActivatedRoute: ActivatedRoute, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.spinner.show();
  }
  brandProducts: any;
  searchWord: string = '';
  ngOnInit(): void {
    this.checkParameters();
    this.getAllBrands();
    this._AuthService.searchWord.next('');
    this.getSearchWord();
  }

  /* Get the 2 pages of branding and store them in allBrands variable */
  getAllBrands(): void {
    this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        this.allBrands = res.data;
        this.spinner.hide();
        this._BrandsService.getAllBrands('?page=2').subscribe({
          next: response => {
            this.allBrands.push(...response.data);
          },
          error: err => {
            this.toastr.error(`Some brands Cant't be Loaded`, `Brands  ` + (err.error.statusMsg || err.name));
          }
        })
      },
      error: err => { this.afterError(err) }
    })
  }
  /* get The search word */
  getSearchWord(): void {
    this._AuthService.searchWord.subscribe(response => {
      this.page = 0;
      this.searchWord = response;
    })
  }

  /* Get the products by Brand */
  getBrandProducts(brandId: string): void {
    this.page = 0;
    this._ProductsService.getProducts(`?brand=${brandId}`).subscribe({
      next: response => {
        this.brandProducts = response.data;
        this.spinner.hide();
      },
      error: err => {
        console.log(err);
        this.afterError(err);
      }
    })
  }

  /* Check if there're brand parameters  */
  checkParameters(): void {
    this._ActivatedRoute.paramMap.subscribe(
      (response) => {
        if (response.get('brand')) {
          this.showBrandProducts(response.get('brand')!)
        } else { this.isProducts = false }
      }
    )
  }

  /* Show Brand's products */
  showBrandProducts(brandId: string): void {
    this.spinner.show();
    this.isProducts = true;
    this.getBrandProducts(brandId)
  }
  afterError(err: any): void {
    this.spinner.hide();
    this.toastr.error(err.error.message || err.statusText, `Brands  ` + (err.error.statusMsg || err.name));
  }
}



