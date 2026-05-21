import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [jwtClient()],
});

export async function getAuthHeaders() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    return {};
  }

  return {
    authorization: `Bearer ${data.token}`,
  };
}
