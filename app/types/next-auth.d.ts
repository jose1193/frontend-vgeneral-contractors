// types/next-auth.d.ts
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
declare module "next-auth" {
  interface User {
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
    token: string; // Añadimos la propiedad token aquí
    user_role: string;
  }

  interface Session {
    user: User;
    accessToken: string;
  }
}
