import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, multiSession } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "Valuemetrix",
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.NEXTAUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  logger: {
    disabled: process.env.NODE_ENV === "production",
    level: "debug",
  },
  account: {
    fields: {
      accountId: "providerAccountId",
      refreshToken: "refreshToken",
      accessToken: "accessToken",
      idToken: "idToken",
      accessTokenExpiresAt: "access_token_expires",
    },
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      console.log("sendResetPassword", data);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri:
        process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback/google",
      enabled: true,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "USER",
      adminRole: "ADMIN",
      impersonationSessionDuration: 60 * 60 * 24, // 24 hours
    }),
    multiSession(),
  ],
  trustedOrigins: ["localhost:3000"],
});
