import { signIn, getSession } from "next-auth/react";
import { useSocialLoginProvider } from "../../../src/hooks/useSocialLoginProvider";
import { SocialLoginData } from "../../types/social-login";

export const useGoogleAuth = () => {
  const { socialLogin, loading, error } = useSocialLoginProvider();

  const handleGoogleSignIn = async (): Promise<SocialLoginData | null> => {
    try {
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        console.error("Google sign-in failed:", result.error);
        return null;
      }

      if (result?.ok) {
        // Get the session after sign in
        const session = await getSession();

        if (!session?.accessToken) {
          console.error("Failed to get access token from session");
          return null;
        }

        const socialLoginResult = await socialLogin(
          "google",
          session.accessToken as string
        );
        return socialLoginResult;
      }

      console.error("Unexpected result from Google sign-in:", result);
      return null;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return null;
    }
  };

  return {
    handleGoogleSignIn,
    loading,
    error,
  };
};
