import { useState, useCallback } from "react";
import * as socialLoginActions from "../../app/lib/actions/socialLoginActions";
import {
  SocialLoginData,
  SocialLoginResponse,
} from "../../app/types/social-login";

export const useSocialLoginProvider = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socialLogin = useCallback(
    async (
      provider: string,
      accessToken: string
    ): Promise<SocialLoginData | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await socialLoginActions.socialLogin(
          provider,
          accessToken
        );

        if (response.success && response.data) {
          return response.data;
        } else {
          console.error("Social login failed:", response);
          setError("Social login failed");
          return null;
        }
      } catch (err) {
        console.error("Error during social login:", err);
        setError("An error occurred during social login");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    socialLogin,
    loading,
    error,
  };
};
