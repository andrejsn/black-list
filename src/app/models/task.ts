export interface Task {
  debtor_id: number;
  date: Date;
  note: string;
  remind_date?: Date;
  remind_note?: string;
}
