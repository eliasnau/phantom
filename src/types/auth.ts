interface TokenPayload {
  userId: string;
  sessionId: string;
  sessionToken: string;
  tokenVersion: number;
}

interface SessionInfo {
  id: string;
  userId: string;
  expires: Date;
  lastActive: Date;
  isValid: boolean;
  sessionToken: string;
  deviceInfo?: {
    browser?: string;
    operatingSystem?: string;
    deviceType?: string;
    isMobile?: boolean;
  };
}

interface UserAuth {
  id: string;
  email: string;
  name: string | null;
  profileImg: string | null;
  emailVerified: Date | null;
  twoFactorEnabled: boolean;
  riskLevel: string;
  banHistory?: Array<{
    reason: string;
    expiresAt: Date | null;
  }>;
}

export type { TokenPayload, SessionInfo, UserAuth };
