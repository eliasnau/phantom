import jwt from "jsonwebtoken";
import { env } from "../env";
import { db } from "../lib/db";
import type { TokenPayload } from "../types/auth";
import { authConfig } from "../configs/auth";

export const generateTokens = async ({
  userId,
  sessionId,
  sessionToken,
}: Omit<TokenPayload, "tokenVersion">) => {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    select: { tokenVersion: true },
  });

  const tokenVersion = session?.tokenVersion || 1;
  const TokenConfig = authConfig.tokens;

  const accessToken = jwt.sign(
    { userId, sessionId, tokenVersion },
    env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: TokenConfig.access.expiresIn,
      issuer: TokenConfig.access.issuer,
      audience: TokenConfig.access.audience,
    }
  );

  const refreshToken = jwt.sign(
    { userId, sessionId, sessionToken },
    env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
      algorithm: "HS256",
      audience: "api:refresh",
      issuer: "auth-service",
    }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET) as TokenPayload;
};
