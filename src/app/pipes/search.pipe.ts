import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {



  transform(products: any[] | undefined, searchWord: string, type: string = 'title'): any[] {
    if (Array.isArray(products)) {

      /* Products that matches the whole search word */
      let arr = products.filter(product => { return product[type].toLowerCase().includes(searchWord.toLowerCase()) });
      if (arr.length > 0 && type == 'title') {
        arr = this.findRelatives(arr, products)
      } else if (products[0]?.title) {
        arr = this.bestMatched(products, searchWord);
        arr = this.findRelatives(arr, products);
      } else if (arr.length == 0) {
        arr = this.bestMatched(products, searchWord, type);
      }
      arr = Array.from(new Set(arr));
      return arr;
    }
    return [];
  }
  /* Find the products with similar cat/subcat/brand */
  findRelatives(arr: any[], products: any[]): any[] {

    /* Products with the same subcategory */
    arr.push(...(products.filter(product => { return product.subcategory[0].slug == arr[0].subcategory[0].slug })));
    /* Products with the same category */
    arr.push(...(products.filter(product => { return product.category.slug == arr[0].category.slug })));
    /* Products with the same brand*/
    arr.push(...(products.filter(product => { return product.brand?.slug == arr[0].brand?.slug })))
    return arr
  }

  /* Best matched  */
  bestMatched(products: any[], searchWord: string, type: string = 'title'): any[] {

    let arr: any[] = [];
    for (let product of products) {
      let matched = 0;
      let len = searchWord.length;
      for (let i = 0; i < len; i++) {
        if (product[type].toLowerCase().includes(searchWord[i].toLowerCase())) {
          matched++;
          if (product[type].toLowerCase().includes((`${searchWord[i - 1]}${searchWord[i]}`).toLowerCase())) {
            matched++
          }
          product['matched'] = matched;
        }
      }
    }

    let maxMatched = (products.filter(product => product['matched'])).reduce((a, b) => Math.max(a, b['matched']), -1)
    arr.push(...products.filter(product => product['matched'] == maxMatched))
    return arr
  }
}
