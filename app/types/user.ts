// app/types/user.ts

export interface UserData {
  name: string;
  last_name: string;
  username: string;
  uuid?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  zip_code?: string | null;
  city?: string | null;
  country?: string | null;
  user_role: string;
  profile_photo_path?: string | null;
  created_at?: string | null;
  update_at?: string | null;
  delete_at?: string | null;
}
