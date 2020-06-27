import { InvoiceStatus } from './invoice_status';

export interface Invoice {
  id: number;
  created_by: number;
  contract_id: number;
  number: string;
  date: Date;
  date_to: Date;
  sum: number;
  status: InvoiceStatus;
  note: string;

  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
}
