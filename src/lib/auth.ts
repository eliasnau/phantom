import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import { users, sessions, accounts, verifications } from "@/server/db/schema";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "./email";
import { env } from "@/env";
// import { twoFactor } from "better-auth/plugins"


export const auth = betterAuth({
    appName: "Starter Kit",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications
        }
    }),
    socialProviders: {
        github: { 
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }, 
    },
    emailAndPassword: {    
        enabled: true,
        requireEmailVerification: false,
        sendResetPassword: async ({ user, url }) => {
            const template = emailTemplates.resetPassword(url);
            await sendEmail({
                to: user.email,
                ...template
            });
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const template = emailTemplates.verifyEmail(url);
            await sendEmail({
                to: user.email,
                ...template
            });
        }
    },
    plugins: [nextCookies()]
});