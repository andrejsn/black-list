import { Injectable } from '@angular/core';
import { Debtor } from '@app/models';

@Injectable({
  providedIn: 'root',
})
export class DebtorCachedService {
  debtor: Debtor;

  constructor() {}
}
