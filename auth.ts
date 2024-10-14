// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User } from "next-auth";
import { login, getUserDetails } from "./app/lib/api";
import { socialLogin } from "./app/lib/actions/socialLoginActions";
export const { auth, handlers } = NextAuth({
  providers: [
    // Login mediante credenciales
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

          // Llama a la función login para autenticar al usuario
          const userData = await login({
            email: credentials.email,
            password: credentials.password,
          });

          if (userData && userData.token) {
            // Obtiene detalles adicionales del usuario
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
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  pages: {
    signIn: "/login", // Página personalizada de inicio de sesión
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.provider === "google" && account.access_token) {
        try {
          const socialLoginResponse = await socialLogin(
            "google",
            account.access_token
          );
          if (socialLoginResponse.success) {
            token.accessToken = socialLoginResponse.data.token;
            token.user = socialLoginResponse.data.user;
          }
        } catch (error) {
          console.error("Error during social login:", error);
        }
      } else if (user) {
        // For non-social login
        token.user = user;
        token.accessToken = (user as any).token;
      }

      return token;
    },

    // Callback para la sesión
    async session({ session, token }) {
      session.user = token.user || {};
      session.accessToken = token.accessToken;
      session.user.user_role = (token.user as any)?.user_role;

      return session;
    },
  },
});
