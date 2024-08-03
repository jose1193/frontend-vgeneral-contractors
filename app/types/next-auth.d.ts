//types/next-auth-d.ts
import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
    accessToken: string;
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    last_name: string;
    username: string;
    uuid: string;
    email: string;
    phone: string;
    address: string;
    zip_code: string;
    city: string;
    country: string;
    gender: string;
    profile_photo_path: string;
    token: string;
    user_role: string;
    email_verified_at: Date | null;
    emailVerified: Date | null;
    created_at: Date | null;
    update_at: Date | null;
    delete_at: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    accessToken: string;
  }
}
