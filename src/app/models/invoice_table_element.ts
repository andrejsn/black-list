import { Invoice } from '.';

export interface InvoiceTableElement extends Invoice {
  toDelete: boolean;
  visible: boolean;
}
