import { db } from "../lib/db";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";

interface CreateSessionParams {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}

export const createSession = async ({
  userId,
  userAgent,
  ipAddress,
}: CreateSessionParams) => {
  const parser = new UAParser(userAgent);
  const parsedUA = parser.getResult();

  return db.session.create({
    data: {
      userId,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
      browser: parsedUA.browser.name,
      operatingSystem: parsedUA.os.name,
      deviceType: parsedUA.device.type || "desktop",
      isMobile: !!parsedUA.device.type,
      sessionToken: crypto.randomUUID(),
    },
  });
};

export const invalidateSession = async (sessionId: string, reason: string) => {
  return db.session.update({
    where: { id: sessionId },
    data: {
      isValid: false,
      revokedAt: new Date(),
      revokedReason: reason,
    },
  });
};
