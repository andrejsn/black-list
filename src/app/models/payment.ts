import { PaymentStatus } from './payment_status';

export interface Payment {
  id: number;
  invoice_id: number;
  date: Date;
  sum: number;
  status: PaymentStatus;

  // created_at: Date;
  // deleted_at: Date;
  // updated_at: Date;
}
