import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL (NEXT_PUBLIC_BETTER_AUTH_URL) is optional when running on the same domain
  // Better Auth will automatically use the current domain + /api/auth
});

export const { signIn, signUp, signOut, useSession } = authClient;
