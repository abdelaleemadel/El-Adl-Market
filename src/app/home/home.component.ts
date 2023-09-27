import { Component,OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { error } from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
allProductss :any;
constructor(private _ProductService:ProductsService){}

ngOnInit(): void {

  this._ProductService.allProducts.subscribe({
    next: (response) => {this.allProductss = response}
  });


 if(!(this.allProductss.length)){
this._ProductService.getProducts().subscribe({
  next: (response) => {
    this.allProductss = response.data;
    this._ProductService.getProducts(`?page=2`).subscribe({
      next: (response) => {
        this.allProductss.push(...response.data);
this._ProductService.allProducts.next(this.allProductss)      }
    })
  },
  error: (err) => console.log(err)
})
  }
}
addItem():void{
  this._ProductService.addItem();
}
removeItem():void {
  this._ProductService.removeItem();
}
}
