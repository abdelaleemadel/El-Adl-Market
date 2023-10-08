import { Component, OnInit } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { error } from 'jquery';
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  p = 1;

  allBrands: any;
  constructor(private _BrandsService: BrandsService) { }
  brandDetails: any;

  ngOnInit(): void {
    this.getAllBrands()
  }
  /* Get the 2 pages of branding and store them in allBrands variable */
  getAllBrands(): void {
    this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        this.allBrands = res.data;
        this._BrandsService.getAllBrands('?page=2').subscribe({
          next: response => {
            this.allBrands.push(...response.data);
            console.log(this.allBrands.length);
          },
          error: err => { console.log('Only first page is loaded') }
        })
      },
      error: err => { console.log('First Page isn"t loaded') }
    })
  }
}



