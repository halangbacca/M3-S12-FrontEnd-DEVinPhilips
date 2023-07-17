import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phone: string): string {
    if (phone.length < 10) return "Invalid input";
    var formatted_number = "(" + phone.slice(0, 2) + ") ";
    if (phone.length === 10) {
      formatted_number += phone.slice(2, 6) + "-" + phone.slice(6);
    } else {
      formatted_number += phone.slice(2, 7) + "-" + phone.slice(7);
    }
    return formatted_number;
  }

}
