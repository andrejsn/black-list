import { TypeOfFine } from './type_of_fine';

export interface Contract {
  id: number;
  created_by: number;
  debtor_id: number;

  is_agreement: boolean;
  number: string;
  date: Date;
  pay_term_days: number;
  fine_per_year: number;
  fine_per_day: number;
  max_fine_percent: number;
  type_of_fine: TypeOfFine;
  note: string;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
