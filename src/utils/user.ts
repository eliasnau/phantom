import { db } from "../lib/db";

export const getUserForAuth = async (userId: string) => {
  return db.user.findUnique({
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
          AND: {
            liftedAt: null,
          },
        },
        select: {
          reason: true,
          expiresAt: true,
        },
      },
    },
  });
};

export const checkUserBan = (banHistory: any[]) => {
  if (banHistory.length > 0) {
    const ban = banHistory[0];
    return {
      isBanned: true,
      reason: ban.reason,
      expiresAt: ban.expiresAt,
    };
  }
  return { isBanned: false };
};
