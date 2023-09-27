import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starts'
})
export class StartsPipe implements PipeTransform {

  transform(rating:number): string[] {

let intNumber = Math.floor(rating);

let arr = new Array(5);
let i = 0;
while ( i < intNumber ){
  arr[i] = 'full';
  i++;
}
if(rating%1 != 0){
  arr[i] = 'half';
  i++;
}
for(i; i < 5; i++){
  arr[i] = 'emty'
}
return arr;
  }

}
