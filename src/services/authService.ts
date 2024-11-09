import { db } from "../lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { UserAuth } from "../types/auth";

export const authService = {
  async validateCredentials(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user?.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  },

  async createUser(data: { email: string; password: string; name?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    return db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        riskLevel: "LOW",
        maxActiveSessions: 5,
        notifyOnNewLogin: true,
        backupCodes: [],
        emailVerificationToken: verificationToken,
      },
    });
  },

  async getUserAuth(userId: string): Promise<UserAuth | null> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImg: true,
        emailVerified: true,
        twoFactorEnabled: true,
        riskLevel: true,
        banHistory: {
          where: {
            OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
            AND: { liftedAt: null },
          },
          select: {
            reason: true,
            expiresAt: true,
          },
        },
      },
    });

    return user as UserAuth | null;
  },

  async updateLoginAttempts(userId: string, failed: boolean) {
    if (!failed) {
      return db.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const attempts = user.failedLoginAttempts + 1;
    const shouldLock = attempts >= 5;

    return db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + 60 * 60 * 1000) : null,
        lastLoginAt: new Date(),
      },
    });
  },
};
