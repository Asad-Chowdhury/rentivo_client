import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  //add the following code and ensure jwtClient import
  plugins: [jwtClient()],
});

export const getAuthHeaders = async () => {
  try {
    const { data: tokenData } = await authClient.token();

    if (!tokenData?.token) {
      return {};
    }

    return {
      authorization: `Bearer ${tokenData.token}`,
    };
  } catch {
    return {};
  }
};
