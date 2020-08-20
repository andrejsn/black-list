export interface Task {
  id: number;
  debtor_id: number;
  date: Date;
  note: string;
  remind_date?: Date;
  remind_note?: string;
  remind_done?: string;
}
