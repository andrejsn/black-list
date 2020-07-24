import { CalendarStatus } from './calendar_status';

export interface Calendar {
  id: number;
  created_by: number;
  debtor_id: number;

  date:Date;
  message: string;
  note: string;

  status: CalendarStatus;
}
