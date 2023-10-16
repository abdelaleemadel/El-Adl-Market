import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(products: any | undefined, sort: string): any[] {
    if (Array.isArray(products)) {
      let arr: any[] = [];
      switch (sort) {
        case 'sold':
          arr = products.sort((a, b) => { return b.sold - a.sold; });
          break;
        case 'rate':
          arr = products.sort((a, b) => { return b.ratingsAverage - a.ratingsAverage; });
          break;
        case 'alpha-asc':
          arr = products.sort((a, b) => { return a.title.localeCompare(b.title); });
          break;
        case 'alpha-desc':
          arr = products.sort((a, b) => { return b.title.localeCompare(a.title); });
          break;
        case 'price-asc':
          arr = products.sort((a, b) => { return a.price - b.price; });
          break;
        case 'price-desc':
          arr = products.sort((a, b) => { return b.price - a.price; });
          break;
        case 'date-asc':
          arr = products.sort((a, b) => { return a.createdAt.localeCompare(b.createdAt); });
          break;
        case 'date-desc':
          arr = products.sort((a, b) => { return b.createdAt.localeCompare(a.createdAt); });
          break;
      }
      return arr;
    } else { return [] }
  }

}
