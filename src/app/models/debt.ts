import { DebtTypeOfFine } from './debt_type_of_fine';

export interface Debt {
  id?: number;
  created_by?: number;
  name: string;
  sum: number;
  date: Date;
  type_of_fine: DebtTypeOfFine;
  inDayPercent: number;
}
