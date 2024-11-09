export const authConfig = {
  // Core authentication settings
  core: {
    allowRegistration: true,
    allowPasswordReset: true,
    requireEmailVerification: true,
    maxConcurrentSessions: 3,
    enforceUniqueDeviceIds: true,
  },

  // Token settings
  tokens: {
    access: {
      expiresIn: "15m",
      audience: "api:access",
      issuer: "auth-service",
    },
    refresh: {
      expiresIn: "7d",
      audience: "api:refresh",
      issuer: "auth-service",
      rotationEnabled: true, //! Higly recommended for security purposes
    },
  },

  // Session management
  session: {
    maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    maxInactiveAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    persistentSessions: true,
    singleSessionPerUser: false,
    validateIPAddress: false, // Not recommended for most applications as router restart or ISP settings can change IP
    validateFingerprint: true,
    validateUserAgent: true,
  },

  // Password policy
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
  },

  oauth: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: "/auth/google/callback",
    },
    github: {
      enabled: false,
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: "/auth/github/callback",
    },
  },

  // Multi-factor authentication
  mfa: {
    enabled: true,
    issuer: "YourApp",
    methods: {
      totp: {
        enabled: true,
      },
      email: {
        enabled: true,
        codeLength: 6,
        expiresIn: 10 * 60, // 10 minutes
      },
      backup: {
        enabled: true,
        codesCount: 10,
        codeLength: 8,
      },
    },
  },

  // Email settings
  email: {
    verificationRequired: true,
    verificationTokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    passwordResetTokenExpiry: 1 * 60 * 60 * 1000, // 1 hour
    resendDelay: 60 * 1000, // 1 minute
  },

  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5,
      skipSuccessfulAttempts: true,
    },
    lockout: {
      enabled: true,
      duration: 30 * 60 * 1000, // 30 minutes
      maxAttempts: 5,
      incrementalDelay: true,
    },
    headers: {
      useSecureCookies: true,
      enableCSRF: true,
      enableHSTS: true,
      enableNoSniff: true,
      enableFrameGuard: true,
    },
  },
};

export type AuthConfig = typeof authConfig;
