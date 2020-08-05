import { TemplateStatus } from './template_status';

export interface Template {
  id: number;
  name: string;
  status: TemplateStatus;
  note: string;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
