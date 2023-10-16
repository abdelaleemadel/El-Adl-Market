import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(products: any | undefined, minPrice: number, maxPrice: number): any[] {
    if (Array.isArray(products)) {
      let arr: any[] = [];
      arr = products.filter(product => { return (product.price >= minPrice && product.price <= maxPrice) })
      return arr;
    } else { return [] }
  }

}
