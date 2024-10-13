export interface SocialLoginData {
  message: string;
  token: string;
  token_type: string;
  token_created_at: string;
  user: {
    id: number;
    uuid: string;
    profile_photo_path: string;
    name: string;
    last_name: string;
    username: string;
    email: string;
    email_verified_at: string | null;
    phone: string | null;
    address: string | null;
    address_2: string | null;
    zip_code: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    gender: string | null;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_role: string;
    role_id: number;
    social_provider: {
      id: number;
      uuid: string;
      provider: string;
      provider_id: string;
      provider_avatar: string;
      user_id: number;
      created_at: string;
      updated_at: string;
    }[];
  };
}

export interface SocialLoginResponse {
  success: boolean;
  data: SocialLoginData;
  message: number;
}
