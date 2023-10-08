import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(date: string): string {
    return String(new Date(date)).split(" ").slice(1, 4).join(" ");
  }

}
