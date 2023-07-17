import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep'
})
export class CepPipe implements PipeTransform {

  transform(cep: string): string {
    return cep.slice(0, 5) + "-" + cep.slice(5);
  }


}
