import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { mongoObjectId } from "./create-object-id";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  multiSession,
  oneTap,
  organization,
  username,
} from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "Valuemetrix",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    generateId: mongoObjectId,
  },
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  logger: {
    disabled: process.env.NODE_ENV === "production",
    level: "debug",
    log(level, message, ...args) {
      console.log(`[${level}] ${message}`, ...args);
    },
  },
  account: {
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
    username(),
    organization(),
    oneTap(),
  ],
  trustedOrigins: ["localhost:3000"],
});
