import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _HttpClient:HttpClient) { }

allProducts = new BehaviorSubject([])
  getProducts(page:string=``):Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products${page}`)
  }
  getProductDetails(id:string):Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
  }
  getCategories():Observable<any>{
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/categories`);
  }
  addItem():void{
    const itemsNumber = $('.items-number');
    let number = Number(itemsNumber.val());
    if(Number.isInteger(number) && number < 100){
      itemsNumber.val(++number)
    }
  }

  removeItem():void{
    const itemsNumber = $('.items-number');
    let number = Number(itemsNumber.val());
    if(Number.isInteger(number) && number > 1){
      itemsNumber.val(--number)
    }
  }

}
