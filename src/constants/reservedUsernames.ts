/**
 * List of reserved usernames that cannot be claimed by users
 */
const RESERVED_USERNAMES = [
  // System/Admin related
  "admin",
  "administrator",
  "system",
  "mod",
  "moderator",
  "support",
  "help",
  "info",
  "root",
  "superuser",

  // Your personal reserved names
  "elias",
  "eliasnau",
  "nau",
  "ceo",
  "founder",
  "owner",
  "developer",
  // Common protected terms
  "user",
  "username",
  "account",
  "settings",
  "profile",
  "login",
  "logout",
  "signin",
  "signout",
  "register",
  "password",

  // Security related
  "security",
  "secure",
  "official",
  "verify",
  "verified",

  // Generic protected terms
  "test",
  "testing",
  "undefined",
  "null",
  "anonymous",
  "unknown",

  // API related
  "api",
  "webhook",
  "callback",

  // Common spam targets
  "payment",
  "billing",
  "invoice",

  // Social media common protected names
  "everyone",
  "all",
  "public",
  "private",
  "group",
  "groups",

  // Platform related
  "platform",
  "phantom",
  "phantom.net",
  "coding",
  "code",
  "developer",
  "developers",
  "dev",
  "team",
  "teams",
  "community",
  "communities",

  // Support variations
  "helpdesk",
  "support_team",
  "customer_support",
  "customerservice",
  "feedback",
  "contact",

  // Status related
  "status",
  "maintenance",
  "system_status",
  "downtime",

  // Marketing/Business
  "marketing",
  "sales",
  "business",
  "partnerships",
  "affiliate",
  "sponsor",
  "advertising",

  // Product related
  "product",
  "feature",
  "features",
  "premium",
  "pro",
  "enterprise",

  // Legal/Privacy
  "legal",
  "privacy",
  "terms",
  "copyright",
  "dmca",
  "report",

  // Common roles
  "staff",
  "employee",
  "manager",
  "supervisor",
  "leader",
  "mentor",

  // Platform specific
  "phantom_team",
  "phantom_support",
  "phantom_help",
  "phantom_official",
  "phantomteam",
  "phantomsupport",
  "phantomhelp",

  // Common tech terms
  "backend",
  "frontend",
  "fullstack",
  "programmer",
  "engineer",
  "tech",
  "software",
  "webdev",
  "devops",
] as const;

/**
 * Regular expression patterns for username validation
 */
const RESERVED_USERNAME_PATTERNS = [
  /^admin.*/i, // Blocks anything starting with 'admin'
  /^mod.*/i, // Blocks anything starting with 'mod'
  /.*phantom.*/i, // Blocks anything containing 'phantom'
  /.*[._-]?admin[._-]?/i, // Blocks admin with separators
  /^(help|support|info|contact).*/i, // Blocks help/support variations
  /^phantom.*/i, // Blocks anything starting with your platform name
  /.*(_)?team(_)?$/i, // Blocks anything ending with team
  /^(dev|developer).*/i, // Blocks developer variations
  /^(admin|mod|staff).?[0-9]+$/i, // Blocks admin1, mod2, staff3 etc.
  /^system.*/i, // Blocks system variations
  /^official.*/i, // Blocks official variations
  /^[._-].*[._-]$/i, // Blocks usernames that start and end with special chars
  /(.)\1{4,}/i, // Blocks excessive repeated characters (e.g., 'aaaaa')
  /^[0-9]+$/i, // Blocks purely numeric usernames
] as const;

/**
 * Type for reserved usernames
 */
type ReservedUsername = (typeof RESERVED_USERNAMES)[number];

/**
 * Checks if a username is reserved or matches any forbidden patterns
 * @param username - The username to check
 * @returns true if the username is reserved or matches forbidden patterns
 */
export const isReservedUsername = (username: string): boolean => {
  const normalizedUsername = username.toLowerCase();

  // Check exact matches
  if (RESERVED_USERNAMES.includes(normalizedUsername as ReservedUsername)) {
    return true;
  }

  // Check pattern matches
  return RESERVED_USERNAME_PATTERNS.some((pattern) =>
    pattern.test(normalizedUsername)
  );
};

/**
 * Checks if a username is available for use
 * @param username - The username to check
 * @returns true if the username is available
 */
export const isUsernameAvailable = (username: string): boolean => {
  return !isReservedUsername(username);
};

/**
 * Validates username format (example rules)
 * @param username - The username to validate
 * @returns true if the username format is valid
 */
export const isValidUsernameFormat = (username: string): boolean => {
  // Username must be 3-20 characters long
  if (username.length < 3 || username.length > 20) return false;

  // Only allow letters, numbers, and single underscore/hyphen
  // Cannot start or end with underscore/hyphen
  const validFormat = /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,18}[a-zA-Z0-9]$/;

  return validFormat.test(username);
};

/**
 * Complete username validation
 * @param username - The username to validate
 * @returns true if the username is valid and available
 */
export const isValidUsername = (username: string): boolean => {
  return isValidUsernameFormat(username) && isUsernameAvailable(username);
};
