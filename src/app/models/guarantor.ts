export interface Guarantor {
  id: number
  created_by: number;
  contract_id: number;
  name: string;
  code: string;
  phone: string;
  address: string;
  email: string;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
