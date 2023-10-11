import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _HttpClient: HttpClient) { }
  allProducts = new BehaviorSubject([]);

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
}
