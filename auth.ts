// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";

export const { auth, handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        // Aquí va tu lógica de autenticación
        // Ejemplo:
        //const url = `${axios.defaults.baseURL}/login`;
        //const res = await fetch(url, {
        const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`;
        const res = await fetch(loginUrl, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        if (res.ok && user) {
          return {
            id: user.id,
            name: user.name,
            last_name: user.last_name,
            username: user.username,

            uuid: user.uuid,
            email: user.email,

            phone: user.phone,
            address: user.address,
            zip_code: user.zip_code,
            city: user.city,
            country: user.country,
            gender: user.gender,
            profile_photo_path: user.profile_photo_path,
            token: user.token, // Asegúrate de que tu API devuelve un token
            user_role: user.user_role,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
