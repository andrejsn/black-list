import { Pipe, PipeTransform } from '@angular/core';
import { Debtor } from '@app/models';

@Pipe({
  name: 'debtorFilterPipe',
})
export class DebtorFilterPipe implements PipeTransform {
  transform(debtor: Debtor[], searchValue: string): any {
    if (!searchValue) {
      return debtor;
    }

    return debtor.filter(
      (v) =>
        v.company.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
        v.reg_number.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    );
  }
}
