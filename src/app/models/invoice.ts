import { InvoiceStatus } from './invoice_status';
import { Payment } from './payment';

export interface Invoice {
  id?: number;
  created_by?: number;
  contract_id?: number;
  number: string;
  date: Date;
  date_to: Date;
  sum: number;
  status: InvoiceStatus;
  note: string;
  payments?: Payment[];

  // created_at: Date;
  // deleted_at: Date;
  // updated_at: Date;
}
