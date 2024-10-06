// app/types/user.ts

export interface UserData {
  id?: number;
  name: string;
  last_name?: string | null;
  username: string;
  uuid?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  zip_code?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  user_role: string;
  profile_photo_path?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}
