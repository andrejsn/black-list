import { CalendarStatus } from './calendar_status';

export interface Calendar {
  id: number;
  created_by: number;
  debtor_id: number;

  date: Date;
  note: string;

  remind_date: Date;
  remind_note: string;
  // remind_status: CalendarStatus;
  remind_done: string;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
