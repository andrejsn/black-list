import { PaymentStatus } from './payment_status';

export interface Payment {
  id?: number;
  invoice_id: number;
  date: Date;
  sum: number;
  status: PaymentStatus;
}
