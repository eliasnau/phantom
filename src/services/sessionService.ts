import { db } from "../lib/db";
import { UAParser } from "ua-parser-js";
import crypto from "crypto";
import type { SessionInfo } from "../types/auth";

export const sessionService = {
  async createSession(params: {
    userId: string;
    userAgent?: string;
    ipAddress?: string;
    trustedDevice?: boolean;
  }) {
    const parser = new UAParser(params.userAgent);
    const userAgent = parser.getResult();

    return db.session.create({
      data: {
        userId: params.userId,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        browser: userAgent.browser.name,
        operatingSystem: userAgent.os.name,
        deviceType: userAgent.device.type || "desktop",
        isMobile: !!userAgent.device.type,
        sessionToken: crypto.randomUUID(),
        trustedDevice: params.trustedDevice ?? false,
      },
    });
  },

  async validateSession(sessionId: string, tokenVersion?: number) {
    const session = await db.session.findFirst({
      where: {
        id: sessionId,
        isValid: true,
        revokedAt: null,
        expires: { gt: new Date() },
      },
    });

    if (!session) return null;

    if (tokenVersion !== undefined && session.tokenVersion !== tokenVersion) {
      return null;
    }

    return session;
  },

  async revokeSession(sessionId: string, reason: string) {
    return db.session.update({
      where: { id: sessionId },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  },

  async updateSessionActivity(sessionId: string) {
    return db.session.update({
      where: { id: sessionId },
      data: { lastActive: new Date() },
    });
  },

  async incrementTokenVersion(sessionId: string) {
    return db.session.update({
      where: { id: sessionId },
      data: {
        tokenVersion: {
          increment: 1,
        },
        lastActive: new Date(),
      },
    });
  },
};
