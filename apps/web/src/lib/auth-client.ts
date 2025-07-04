import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // baseURL (NEXT_PUBLIC_BETTER_AUTH_URL) is optional when running on the same domain
  // Better Auth will automatically use the current domain + /api/auth
  plugins: [
    emailOTPClient(),
    inferAdditionalFields({
      user: {
        encryptionSalt: {
          type: "string",
          required: false,
          defaultValue: "",
          returned: true,
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
