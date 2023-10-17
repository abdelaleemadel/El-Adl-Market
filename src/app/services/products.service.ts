import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  allProducts = new BehaviorSubject('');

  constructor(private _HttpClient: HttpClient, private toastr: ToastrService) {
    this.storeProducts()
  }

  getProducts(param: string = ``): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products${param}`)
  }
  getProductDetails(id: string): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
  }
  getCategories(param: string = ''): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/categories${param}`);
  }
  addItem(id: string, event: Event): void {
    const plusIcon = $(event.target!);
    const itemsNumber = $(plusIcon).prev();
    let number = Number(itemsNumber.val());
    if (Number.isInteger(number) && number < 100) {
      itemsNumber.val(++number)
    }
  }

  removeItem(id: string, event: Event): void {
    const minusIcon = $(event.target!);
    const itemsNumber = $(minusIcon).next();
    let number = Number(itemsNumber.val());
    if (Number.isInteger(number) && number > 1) {
      itemsNumber.val(--number)
    }
  }

  /* Close the product details modal */
  closeDetailsModal(): void {
    const closeModal = $('#productDetailsModal div[data-bs-dismiss="modal"]');
    if (closeModal.length) {
      closeModal.trigger('click')
    }
  }

  /* Get all the subcategories */
  getSubCategories(param: string = ''): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/subcategories${param}`);
  }

  /* call the products api and store them in the Behaviour subject */
  storeProducts(): void {
    let temp: any;
    this.getProducts().subscribe({
      next: (response) => {
        temp = response.data
        this.allProducts.next(temp);
        this.getProducts(`?page=2`).subscribe({
          next: (response) => {
            temp.push(...response.data);
            this.allProducts.next(temp);
          },
          error: err => {
            this.toastr.error(`Some Products can't be loaded`, `Products   ${err.error.statusMsg}`);
          }
        });
      },
      error: (err) => {
        this.allProducts.next('error');
        this.toastr.error(err.error.message || err.statusText, `Products  ` + (err.error.statusMsg || err.name));
      }
    });
  }
}
