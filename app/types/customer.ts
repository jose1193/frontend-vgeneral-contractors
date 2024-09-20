export interface CustomerData {
  id?: number;
  uuid?: string;
  name: string;
  last_name: string;
  cell_phone?: string | null;
  home_phone?: string | null;
  email: string;
  occupation?: string | null;
  created_at?: string | null;
  update_at?: string | null;
}
