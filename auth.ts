// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";
import { login, getUserDetails } from "./app/lib/api";

export const { auth, handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        try {
          if (
            !credentials ||
            typeof credentials.email !== "string" ||
            typeof credentials.password !== "string"
          ) {
            return null;
          }

          const userData = await login({
            email: credentials.email,
            password: credentials.password,
          });

          if (userData && userData.token) {
            const userDetails = await getUserDetails(userData.token);

            const user: User = {
              id: userDetails.id,
              name: userDetails.name,
              last_name: userDetails.last_name,
              username: userDetails.username,
              uuid: userDetails.uuid,
              email: userDetails.email,
              email_verified_at: userDetails.email_verified_at
                ? new Date(userDetails.email_verified_at)
                : null,
              emailVerified: userDetails.email_verified_at
                ? new Date(userDetails.email_verified_at)
                : null,
              phone: userDetails.phone,
              address: userDetails.address,
              zip_code: userDetails.zip_code,
              city: userDetails.city,
              country: userDetails.country,
              gender: userDetails.gender,
              profile_photo_path: userDetails.profile_photo_path,
              token: userData.token,
              user_role: userDetails.user_role,
              created_at: userDetails.created_at
                ? new Date(userDetails.created_at)
                : null,
              update_at: userDetails.updated_at
                ? new Date(userDetails.updated_at)
                : null,
              delete_at: userDetails.delete_at
                ? new Date(userDetails.delete_at)
                : null,
            };
            return user;
          }

          return null;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      // Asegúrate de que el rol esté incluido en la sesión
      session.user.user_role = token.user.user_role;
      return session;
    },
  },
});
