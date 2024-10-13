// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";
import { login, getUserDetails } from "./app/lib/api";
import GoogleProvider from "next-auth/providers/google";
import { socialLogin } from "./app/lib/actions/socialLoginActions";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
        token.accessToken = user.token;
      }
      if (account && account.provider === "google") {
        try {
          const response = await socialLogin("google", account.access_token!);

          if (response.success) {
            if (Array.isArray(response.data)) {
              console.error("Unexpected array response from social login");
              // Handle unexpected array response
              // You might want to throw an error or handle this case differently
            } else if (
              typeof response.data === "object" &&
              response.data !== null
            ) {
              // Assuming response.data contains user information and token
              token.user = response.data.user;
              token.accessToken = response.data.token;
            } else {
              console.error("Unexpected response format from social login");
            }
          } else {
            console.error("Social login failed:", response);
          }
        } catch (error) {
          console.error("Error during social login:", error);
        }
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
