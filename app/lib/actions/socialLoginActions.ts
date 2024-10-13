import { fetchWithCSRF } from "../api";
import { SocialLoginResponse } from "../../types/social-login";

export const socialLogin = (
  provider: string,
  accessToken: string
): Promise<SocialLoginResponse> =>
  fetchWithCSRF("/api/social-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, access_provider_token: accessToken }),
  });
