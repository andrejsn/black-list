export interface Contract {
  id?: number;

  with_agreement: boolean;
  number?: string;
  date?: Date;
  pay_term_days: number;
  fine_per_year: number;
  fine_per_day: number;
  max_fine_percent: number;
  type_of_fine: string;
  note: string;
}
