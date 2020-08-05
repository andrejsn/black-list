export interface Representative {
  id: number;
  created_by: number;
  contract_id: number;
  name: string;
  code: string;
  position: string;
  phone: string;
  address: string;
  email: string;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
