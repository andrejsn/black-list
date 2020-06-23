export interface Debtor {
  id: number;
  created_by: number;

  company: string;
  reg_number: string;
  debt: number;
  legal_address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  fax: string;
  email: string;
  homepage: string;
  bank_name: string;
  bank_account_number: string;
  status: string;
  note: string;

  created_at: Date;
  updated_at: Date;
}
